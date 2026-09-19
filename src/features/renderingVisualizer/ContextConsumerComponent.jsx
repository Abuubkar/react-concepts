import React, { useContext } from 'react';
import useRenderDiagnostics from '../../hooks/useRenderDiagnostics';
import { VisualizerContext } from './renderingContext';

// Utility to format timestamp for rendering
function formatTime(ts) {
  if (!ts) return '—';
  return `${ts.toFixed(1)} ms`;
}

export default function ContextConsumerComponent({
  registerRender,
  renderStats,
  selectedId,
  onSelect
}) {
  const context = useContext(VisualizerContext);

  useRenderDiagnostics(
    'ContextConsumer',
    null,
    null,
    context.value,
    registerRender
  );

  const stats = renderStats.ContextConsumer || { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' };
  const isSelected = selectedId === 'ContextConsumer';
  const nodeClass = `tree-node ${isSelected ? 'selected' : ''} ${
    stats.status === 'rendered' ? 'rendered-state' : stats.status === 'skipped' ? 'skipped-state' : ''
  }`;

  return (
    <div
      className={nodeClass}
      onClick={(e) => { e.stopPropagation(); onSelect('ContextConsumer'); }}
    >
      <div className="node-title">
        <span>Context Consumer</span>
        <span className="badge">Context</span>
      </div>
      
      <div className="node-stat">Renders: <strong>{stats.count}</strong></div>
      <div className="node-stat">Time: {formatTime(stats.timestamp)}</div>
      <div className={`node-reason ${stats.status === 'skipped' ? 'skipped-reason' : ''}`}>
        {stats.status === 'skipped' ? 'Skipped (Bailout)' : stats.reason}
      </div>

      <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--neon-purple)', fontWeight: 'bold' }}>
        Consumed value: {context.value}
      </div>
    </div>
  );
}
