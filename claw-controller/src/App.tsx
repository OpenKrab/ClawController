import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

type GatewayState = 'running' | 'stopped' | 'starting' | 'stopping' | 'error' | 'checking';

function App() {
  const [state, setState] = useState<GatewayState>('checking');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStatus = useCallback(async () => {
    try {
      const res = await invoke('claw_status') as string;
      // Stricter check: Look for 'Runtime: running' specifically
      const isRunning = res.toLowerCase().includes('runtime: running');
      setState(isRunning ? 'running' : 'stopped');
      setError(null);
    } catch (err: any) {
      setState('error');
      setError(err.toString());
    } finally {
      setLastUpdate(new Date());
    }
  }, []);

  const runCmd = async (cmd: 'claw_start' | 'claw_stop' | 'claw_restart') => {
    setState(cmd === 'claw_stop' ? 'stopping' : 'starting');

    // Safety timeout: if it takes > 8s, force refresh to unblock UI
    const safetyTimer = setTimeout(() => {
      fetchStatus();
    }, 8000);

    try {
      if (cmd === 'claw_stop') {
        await invoke('claw_stop');
        await invoke('claw_kill_node');
      } else {
        await invoke(cmd);
      }
      clearTimeout(safetyTimer);
      setTimeout(fetchStatus, 3000);
    } catch (err: any) {
      clearTimeout(safetyTimer);
      setError(err.toString());
      setState('error');
      fetchStatus();
    }
  };

  const smartFix = async () => {
    setState('starting');
    setError('Performing Deep Reset (Cleaning up Node processes...)');
    try {
      // We will create this 'claw_kill_node' command in Rust next
      await invoke('claw_stop');
      await invoke('claw_kill_node');
      await invoke('claw_start');
      setTimeout(fetchStatus, 5000);
    } catch (err: any) {
      setError('Smart Fix partly failed, check manual status.');
      fetchStatus();
    }
  };

  const openLogs = async () => {
    try {
      await invoke('claw_open_logs');
    } catch (err: any) {
      setError('Failed to open logs: ' + err.toString());
    }
  };

  const openDoctor = async () => {
    try {
      await invoke('claw_open_doctor');
    } catch (err: any) {
      setError('Failed to open doctor: ' + err.toString());
    }
  };

  // Use a ref to track if a fetch is in progress to avoid overlapping cmd processes
  const fetching = useRef(false);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      if (!fetching.current && state !== 'starting' && state !== 'stopping') {
        fetching.current = true;
        fetchStatus().finally(() => {
          fetching.current = false;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus, state]);

  const getStatusColor = () => {
    switch (state) {
      case 'running': return '#4CAF50';
      case 'stopped': return '#f44336';
      case 'starting':
      case 'stopping': return '#ff9800';
      case 'error': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'running': return 'Running 🟢';
      case 'stopped': return 'Stopped 🔴';
      case 'starting': return 'Starting... 🟡';
      case 'stopping': return 'Stopping... 🟡';
      case 'error': return 'Error ⚠️';
      case 'checking': return 'Checking... 🔍';
    }
  };

  return (
    <div style={{
      padding: '1rem',
      boxSizing: 'border-box',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      textAlign: 'center',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: '#0f0f0f',
      color: '#ffffff'
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        width: '100%',
        margin: '0 auto',
        border: '1px solid #333'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '800', lineHeight: 1.2 }}>ClawController 🦞</h1>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Gateway Management</p>

        <div style={{
          background: '#252525',
          padding: '1.25rem',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          border: `2px solid ${getStatusColor()}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>GATEWAY STATUS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusColor() }}>
            {getStatusText()}
          </div>
          {error && <div style={{ color: '#ff5252', fontSize: '0.8rem', marginTop: '10px' }}>{error}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
          <button
            onClick={() => runCmd('claw_start')}
            disabled={state === 'running' || state === 'starting' || state === 'stopping'}
            style={{
              background: state === 'running' ? '#333' : '#4CAF50',
              color: 'white',
              padding: '1.2rem',
              border: 'none',
              borderRadius: '12px',
              cursor: state === 'running' ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.1s, opacity 0.2s',
              opacity: (state === 'running' || state === 'starting' || state === 'stopping') ? 0.5 : 1
            }}
          >
            Start Gateway
          </button>
          <button
            onClick={() => runCmd('claw_stop')}
            disabled={state === 'stopped' || state === 'starting' || state === 'stopping'}
            style={{
              background: state === 'stopped' ? '#333' : '#f44336',
              color: 'white',
              padding: '1.2rem',
              border: 'none',
              borderRadius: '12px',
              cursor: state === 'stopped' ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.1s, opacity 0.2s',
              opacity: (state === 'stopped' || state === 'starting' || state === 'stopping') ? 0.5 : 1
            }}
          >
            Stop Gateway
          </button>
        </div>

        <button
          onClick={smartFix}
          disabled={state === 'starting' || state === 'stopping'}
          style={{
            width: '100%',
            background: 'linear-gradient(45deg, #FF512F, #DD2476)',
            color: 'white',
            padding: '1.2rem',
            border: 'none',
            borderRadius: '12px',
            cursor: state === 'starting' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginBottom: '1rem',
            opacity: (state === 'starting' || state === 'stopping') ? 0.5 : 1,
            boxShadow: '0 4px 15px rgba(221, 36, 118, 0.3)'
          }}
        >
          Smart Fix ⚡ (Hard Reset)
        </button>

        <button
          onClick={() => runCmd('claw_restart')}
          disabled={state === 'starting' || state === 'stopping'}
          style={{
            width: '100%',
            background: 'transparent',
            color: '#ff9800',
            padding: '1rem',
            border: '2px solid #ff9800',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '1.2rem',
            opacity: (state === 'starting' || state === 'stopping') ? 0.5 : 1
          }}
        >
          Restart Service
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <button
            onClick={openLogs}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#4CAF50',
              padding: '1rem',
              border: '2px solid #4CAF50',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Live Logs 📄
          </button>

          <button
            onClick={openDoctor}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#2196F3',
              padding: '1rem',
              border: '2px solid #2196F3',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Run Doctor 🩺
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#555' }}>
          <span>Last sync: {lastUpdate.toLocaleTimeString()}</span>
          <button
            onClick={fetchStatus}
            style={{
              background: '#007AFF',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          >
            Manual Sync 🔄
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <a
          href="http://127.0.0.1:18789"
          target="_blank"
          style={{
            color: state === 'running' ? '#61dafb' : '#444',
            textDecoration: 'none',
            fontSize: '0.9rem',
            pointerEvents: state === 'running' ? 'auto' : 'none',
            transition: 'color 0.3s'
          }}
        >
          {state === 'running' ? '➔ Open Dashboard' : 'Dashboard Unavailable (Gateway Stopped)'}
        </a>
      </div>
    </div>
  );
}

export default App;
