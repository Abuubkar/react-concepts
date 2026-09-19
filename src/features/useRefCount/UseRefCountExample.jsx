import { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button';

export default function UseRefCountExample() {
  const refCount = useRef(0);
  const [renderCount, setRenderCount] = useState(0);
  
  const renderCountRef = useRef(0);

  const logContainerRef = useRef(null);

  const incrementRef = () => {
    refCount.current += 1;
    // Log mutation directly to the DOM console
    if (logContainerRef.current) {
      const entry = document.createElement('div');
      entry.className = 'console-entry mutation';
      entry.innerHTML = `<span class="tag tag-mutation">[Ref Mutation]</span> refCount.current mutated to <strong>${refCount.current}</strong> (in-memory change only)`;
      logContainerRef.current.appendChild(entry);
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  };

  const triggerRender = () => {
    setRenderCount((value) => value + 1);
  };

  const clearLogs = () => {
    if (logContainerRef.current) {
      logContainerRef.current.innerHTML = '';
    }
  };

  // Run on every commit
  useEffect(() => {
    renderCountRef.current += 1;
    if (logContainerRef.current) {
      const renderEntry = document.createElement('div');
      renderEntry.className = 'console-entry render';
      renderEntry.innerHTML = `<span class="tag tag-render">[Render Phase]</span> Executing component body (Render #${renderCountRef.current})`;
      logContainerRef.current.appendChild(renderEntry);

      const commitEntry = document.createElement('div');
      commitEntry.className = 'console-entry commit';
      commitEntry.innerHTML = `<span class="tag tag-commit">[Commit Phase]</span> DOM updated & painted successfully`;
      logContainerRef.current.appendChild(commitEntry);

      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  });

  return (
    <div className="example-content">
      <style>{`
        .console-box {
          background: #1e1e24;
          color: #f8f8f2;
          font-family: var(--mono, Courier, monospace);
          font-size: 13px;
          border-radius: 8px;
          border: 1px solid var(--border);
          overflow: hidden;
          margin-top: 16px;
        }
        .console-header {
          background: #2a2b36;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          font-weight: 600;
        }
        .console-logs {
          padding: 12px;
          height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .console-entry {
          line-height: 1.5;
          padding: 2px 0;
          animation: fadeIn 0.2s ease-out;
        }
        .tag {
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: 8px;
          font-size: 11px;
          text-transform: uppercase;
        }
        .tag-mutation {
          background: #ffb86c;
          color: #282a36;
        }
        .tag-render {
          background: #8be9fd;
          color: #282a36;
        }
        .tag-commit {
          background: #50fa7b;
          color: #282a36;
        }
        .clear-btn {
          background: transparent;
          border: 1px solid #6272a4;
          color: #f8f8f2;
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }
        .clear-btn:hover {
          background: #6272a4;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h2>useRef count pitfall & Phase Timing</h2>

      <p className="example-copy">
        This interactive demo illustrates React's internal execution timing. Note when component execution (**Render Phase**) and DOM updates (**Commit Phase**) occur compared to in-memory ref mutations.
      </p>

      <div className="example-actions">
        <Button onClick={incrementRef}>
          Increment ref count
        </Button>

        <Button variant="secondary" onClick={triggerRender}>
          Force render
        </Button>
      </div>

      <div id="output">
        <p>
          {/* This demo intentionally reads the ref during render to show the pitfall. */}
          {/* eslint-disable-next-line react-hooks/refs */}
          <strong>refCount.current:</strong> {refCount.current}
        </p>
        <p>
          <strong>renderCount state:</strong> {renderCount}
        </p>
      </div>

      <div className="console-box">
        <div className="console-header">
          <span>React Lifecycle Logs</span>
          <button className="clear-btn" onClick={clearLogs}>Clear</button>
        </div>
        <div className="console-logs" ref={logContainerRef}>
          {/* Direct DOM writes go here */}
        </div>
      </div>

      <p className="example-meta" style={{ marginTop: '12px' }}>
        <strong>Instructions:</strong>
        <br />
        1. Click <strong>Increment ref count</strong>: Notice a log is added for the mutation, but no Render or Commit phases run (and the UI value above doesn't update).
        <br />
        2. Click <strong>Force render</strong>: Notice both Render and Commit phases run, and the UI finally updates to display the current ref value.
      </p>
    </div>
  );
}

