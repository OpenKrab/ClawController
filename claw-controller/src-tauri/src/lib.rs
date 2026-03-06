// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::Command;
use std::str;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[tauri::command]
async fn claw_exec(subcmd: Vec<String>) -> Result<String, String> {
    let program = if cfg!(target_os = "windows") {
        "cmd"
    } else {
        "openclaw"
    };

    let mut args = if cfg!(target_os = "windows") {
        vec!["/C".to_string(), "openclaw".to_string()]
    } else {
        vec![]
    };
    args.extend(subcmd);

    // Run in a separate thread to avoid blocking the main tokio runtime
    let output = tauri::async_runtime::spawn_blocking(move || {
        let mut cmd = Command::new(program);
        cmd.args(&args);

        // --- CRITICAL FIX: Isolate the environment ---
        // Strip out Tauri/Vite/Pnpm env vars that force OpenClaw into "dev" token mode.
        // pnpm passes down its package context to child processes.
        let envs: Vec<String> = std::env::vars()
            .map(|(k, _)| k)
            .filter(|k| k.to_lowercase().starts_with("npm_") || k.to_lowercase().starts_with("pnpm_") || k == "NODE_ENV" || k == "INIT_CWD")
            .collect();

        for env_key in envs {
            cmd.env_remove(env_key);
        }
        cmd.env_remove("OPENCLAW_DEV");

        // Force the execution to happen in the user's home directory
        // so it doesn't accidentally pick up a local package.json or git repo
        if let Some(home_dir) = std::env::var_os("USERPROFILE") {
            cmd.current_dir(home_dir);
        } else if let Some(home_dir) = std::env::var_os("HOME") {
            cmd.current_dir(home_dir);
        }

        #[cfg(target_os = "windows")]
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW

        cmd.output()
    }).await.map_err(|e| e.to_string())?.map_err(|e| e.to_string())?;

    let stdout = str::from_utf8(&output.stdout).unwrap_or("").to_string();
    let stderr = str::from_utf8(&output.stderr).unwrap_or("").to_string();

    if !output.status.success() {
        return Err(format!("Error (code {}): {}\n{}", output.status.code().unwrap_or(-1), stderr, stdout));
    }
    Ok(stdout + &stderr)
}

#[tauri::command]
async fn claw_start() -> Result<String, String> {
    claw_exec(vec!["gateway".to_string(), "start".to_string()]).await
}

#[tauri::command]
async fn claw_stop() -> Result<String, String> {
    claw_exec(vec!["gateway".to_string(), "stop".to_string()]).await
}

#[tauri::command]
async fn claw_restart() -> Result<String, String> {
    claw_exec(vec!["gateway".to_string(), "restart".to_string()]).await
}

#[tauri::command]
async fn claw_status() -> Result<String, String> {
    claw_exec(vec!["gateway".to_string(), "status".to_string()]).await
}

#[tauri::command]
async fn claw_kill_node() -> Result<String, String> {
    if cfg!(target_os = "windows") {
        let mut cmd = Command::new("powershell");
        // We look for node processes that have 'openclaw' in their command line
        let script = "Get-CimInstance Win32_Process -Filter \"name = 'node.exe' AND commandline LIKE '%openclaw%'\" | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }";
        cmd.args(&["-Command", script]);
        
        #[cfg(target_os = "windows")]
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
        
        let _ = cmd.output(); 
        Ok("OpenClaw processes terminated".to_string())
    } else {
        // Simple pkill for unix-like systems
        let mut cmd = Command::new("pkill");
        cmd.args(&["-f", "openclaw"]);
        let _ = cmd.output();
        Ok("OpenClaw processes terminated".to_string())
    }
}

#[tauri::command]
async fn claw_open_logs() -> Result<String, String> {
    let program = if cfg!(target_os = "windows") { "cmd" } else { "sh" };
    let mut cmd = Command::new(program);

    if cfg!(target_os = "windows") {
        // /C runs the command and terminates, but 'start cmd /K' opens a new visible terminal window
        // that runs the command and stays open (/K).
        cmd.args(&["/C", "start", "Claw Logs", "cmd", "/K", "openclaw logs --follow"]);
    } else if cfg!(target_os = "macos") {
        cmd.args(&["-c", "open -a Terminal -e \"openclaw logs --follow\""]);
    } else {
        cmd.args(&["-c", "x-terminal-emulator -e \"openclaw logs --follow\""]);
    }

    // Strip envs just like other commands to avoid Dev mismatch
    let envs: Vec<String> = std::env::vars()
        .map(|(k, _)| k)
        .filter(|k| k.to_lowercase().starts_with("npm_") || k.to_lowercase().starts_with("pnpm_") || k == "NODE_ENV" || k == "INIT_CWD")
        .collect();
    for env_key in envs {
        cmd.env_remove(env_key);
    }
    cmd.env_remove("OPENCLAW_DEV");

    if let Some(home_dir) = std::env::var_os("USERPROFILE").or_else(|| std::env::var_os("HOME")) {
        cmd.current_dir(home_dir);
    }

    // We use spawn() instead of output() so it spins up asynchronously and unattached
    match cmd.spawn() {
        Ok(_) => Ok("Logs opened in new terminal".to_string()),
        Err(e) => Err(format!("Failed to open logs: {}", e)),
    }
}

#[tauri::command]
async fn claw_open_doctor() -> Result<String, String> {
    let program = if cfg!(target_os = "windows") { "cmd" } else { "sh" };
    let mut cmd = Command::new(program);

    if cfg!(target_os = "windows") {
        cmd.args(&["/C", "start", "Claw Doctor", "cmd", "/K", "openclaw doctor"]);
    } else if cfg!(target_os = "macos") {
        cmd.args(&["-c", "open -a Terminal -e \"openclaw doctor\""]);
    } else {
        cmd.args(&["-c", "x-terminal-emulator -e \"openclaw doctor\""]);
    }

    let envs: Vec<String> = std::env::vars()
        .map(|(k, _)| k)
        .filter(|k| k.to_lowercase().starts_with("npm_") || k.to_lowercase().starts_with("pnpm_") || k == "NODE_ENV" || k == "INIT_CWD")
        .collect();
    for env_key in envs {
        cmd.env_remove(env_key);
    }
    cmd.env_remove("OPENCLAW_DEV");

    if let Some(home_dir) = std::env::var_os("USERPROFILE").or_else(|| std::env::var_os("HOME")) {
        cmd.current_dir(home_dir);
    }

    match cmd.spawn() {
        Ok(_) => Ok("Doctor opened in new terminal".to_string()),
        Err(e) => Err(format!("Failed to open doctor: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            claw_start, claw_stop, claw_restart, claw_status, claw_kill_node, claw_open_logs, claw_open_doctor
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
