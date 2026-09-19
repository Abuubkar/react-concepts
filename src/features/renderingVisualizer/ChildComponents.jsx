import React, { useState, useContext, useEffect, useRef } from 'react';
import useRenderDiagnostics from '../../hooks/useRenderDiagnostics';
import { VisualizerContext } from './renderingContext';
import Button from '../../components/Button';

// Utility to format timestamp for rendering
function formatTime(ts) {
  if (!ts) return '—';
  return `${ts.toFixed(1)} ms`;
}

// Child A: Standard component with its own local state
export function ChildA({ registerRender, renderStats, selectedId, onSelect, childAUpdateSignal = 0 }) {
  const [localCount, setLocalCount] = useState(0);
  const context = useContext(VisualizerContext);
  const lastSignal = useRef(0);

  useEffect(() => {
    if (childAUpdateSignal > lastSignal.current) {
      lastSignal.current = childAUpdateSignal;
      setLocalCount((c) => c + 1);
    }
  }, [childAUpdateSignal]);

  useRenderDiagnostics(
    'ChildA',
    null,
    localCount,
    context.value,
    registerRender
  );

  const stats = renderStats.ChildA || { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' };
  const isSelected = selectedId === 'ChildA';
  const nodeClass = `tree-node ${isSelected ? 'selected' : ''} ${
    stats.status === 'rendered' ? 'rendered-state' : stats.status === 'skipped' ? 'skipped-state' : ''
  }`;

  return (
    <div className={nodeClass} onClick={(e) => { e.stopPropagation(); onSelect('ChildA'); }}>
      <div className="node-title">
        <span>Child A</span>
        <span className="badge">Stateful</span>
      </div>
      
      <div className="node-stat">Renders: <strong>{stats.count}</strong></div>
      <div className="node-stat">Time: {formatTime(stats.timestamp)}</div>
      <div className={`node-reason ${stats.status === 'skipped' ? 'skipped-reason' : ''}`}>
        {stats.status === 'skipped' ? 'Skipped (Bailout)' : stats.reason}
      </div>

      <div style={{ marginTop: '8px' }}>
        <Button 
          style={{ padding: '4px 8px', minHeight: 'unset', height: '24px', fontSize: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            setLocalCount(c => c + 1);
          }}
        >
          State +1 ({localCount})
        </Button>
      </div>
    </div>
  );
}

// Child B: Reusable component that can be memoized
export function ChildB({ data, onAction, registerRender, renderStats, selectedId, onSelect, isMemoized, contextValue }) {
  useRenderDiagnostics(
    'ChildB',
    { data, onAction },
    null,
    contextValue,
    registerRender
  );

  const stats = renderStats.ChildB || { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' };
  const isSelected = selectedId === 'ChildB';
  const nodeClass = `tree-node ${isSelected ? 'selected' : ''} ${
    stats.status === 'rendered' ? 'rendered-state' : stats.status === 'skipped' ? 'skipped-state' : ''
  }`;

  return (
    <div className={nodeClass} onClick={(e) => { e.stopPropagation(); onSelect('ChildB'); }}>
      <div className="node-title">
        <span>Child B</span>
        <span className="badge">{isMemoized ? 'React.memo' : 'Standard'}</span>
      </div>
      
      <div className="node-stat">Renders: <strong>{stats.count}</strong></div>
      <div className="node-stat">Time: {formatTime(stats.timestamp)}</div>
      <div className={`node-reason ${stats.status === 'skipped' ? 'skipped-reason' : ''}`}>
        {stats.status === 'skipped' ? 'Skipped (Bailout)' : stats.reason}
      </div>

      <div style={{ marginTop: '6px', fontSize: '9px', color: 'var(--text-dim)' }}>
        Prop value: <strong>{data?.value || 'null'}</strong>
      </div>
    </div>
  );
}

// Memoized version of ChildB with custom comparison
// Only compare data and onAction props that actually affect rendering logic
const ChildBMemoComponent = React.memo(
  ChildB,
  (prevProps, nextProps) => {
    // Compare only the props that affect rendering logic
    const dataChanged = prevProps.data !== nextProps.data;
    const onActionChanged = prevProps.onAction !== nextProps.onAction;
    const shouldSkip = !dataChanged && !onActionChanged;
    
    // Return true to SKIP re-render, false to re-render
    return shouldSkip;
  }
);

export const ChildBMemo = ChildBMemoComponent;

// Child C: Standard component with no props or state
export function ChildC({ registerRender, renderStats, selectedId, onSelect }) {
  const context = useContext(VisualizerContext);

  useRenderDiagnostics(
    'ChildC',
    null,
    null,
    context.value,
    registerRender
  );

  const stats = renderStats.ChildC || { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' };
  const isSelected = selectedId === 'ChildC';
  const nodeClass = `tree-node ${isSelected ? 'selected' : ''} ${
    stats.status === 'rendered' ? 'rendered-state' : stats.status === 'skipped' ? 'skipped-state' : ''
  }`;

  return (
    <div className={nodeClass} onClick={(e) => { e.stopPropagation(); onSelect('ChildC'); }}>
      <div className="node-title">
        <span>Child C</span>
        <span className="badge">Static</span>
      </div>
      
      <div className="node-stat">Renders: <strong>{stats.count}</strong></div>
      <div className="node-stat">Time: {formatTime(stats.timestamp)}</div>
      <div className={`node-reason ${stats.status === 'skipped' ? 'skipped-reason' : ''}`}>
        {stats.status === 'skipped' ? 'Skipped (Bailout)' : stats.reason}
      </div>
    </div>
  );
}
