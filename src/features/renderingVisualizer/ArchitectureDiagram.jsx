import React from 'react';

export default function ArchitectureDiagram({ activePhase = 'none' }) {
  const steps = [
    { id: 'state', label: '1. State Update', y: 10, desc: 'setState() triggers render' },
    { id: 'scheduler', label: '2. React Scheduler', y: 35, desc: 'Prioritizes and queues work' },
    { id: 'render', label: '3. Render Phase', y: 60, desc: 'Executes component function body' },
    { id: 'reconciliation', label: '4. Reconciliation', y: 85, desc: 'Diffs new Virtual DOM with old' },
    { id: 'commit', label: '5. Commit Phase', y: 110, desc: 'Mutates DOM & runs useEffect' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <svg className="diag-svg" viewBox="0 0 300 135">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--neon-purple)" />
          </marker>
        </defs>

        {steps.map((step, idx) => {
          const isActive = activePhase === step.id;
          return (
            <g key={step.id}>
              {/* Step Node */}
              <rect
                x="50"
                y={step.y}
                width="200"
                height="18"
                rx="4"
                className={`diag-node ${isActive ? 'active-phase' : ''}`}
              />
              <text
                x="150"
                y={step.y + 9}
                className={`diag-text ${isActive ? 'active-text' : ''}`}
              >
                {step.label}
              </text>

              {/* Connecting Arrow */}
              {idx < steps.length - 1 && (
                <line
                  x1="150"
                  y1={step.y + 18}
                  x2="150"
                  y2={steps[idx + 1].y}
                  className={`diag-arrow ${isActive || activePhase === steps[idx+1].id ? 'active-arrow' : ''}`}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ padding: '0 4px' }}>
        {steps.map((step) => {
          const isActive = activePhase === step.id;
          if (!isActive) return null;
          return (
            <div key={step.id} style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--neon-purple)', marginBottom: '2px' }}>
                Active: {step.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', lineHeight: '1.3' }}>
                {step.desc}
              </div>
            </div>
          );
        })}
        {activePhase === 'none' && (
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', padding: '4px 0' }}>
            Idle. Trigger an action to trace the render pipeline.
          </div>
        )}
      </div>
    </div>
  );
}
