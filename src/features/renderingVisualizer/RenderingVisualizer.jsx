import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { VisualizerContext, VisualizerContextProvider } from './renderingContext';
import ParentComponent from './ParentComponent';
import ContextConsumerComponent from './ContextConsumerComponent';
import ArchitectureDiagram from './ArchitectureDiagram';
import useRenderDiagnostics from '../../hooks/useRenderDiagnostics';
import Button from '../../components/Button';
import './RenderingVisualizer.css';

function flowClass(status) {
  if (status === 'rendered') return 'render-flow';
  if (status === 'skipped') return 'skip-flow';
  return '';
}

function nodeStateClass(stats) {
  if (stats.status === 'rendered') return 'rendered-state';
  if (stats.status === 'skipped') return 'skipped-state';
  return '';
}

function ContextUpdateButton({ onClickTrigger }) {
  const { value, incrementValue } = useContext(VisualizerContext);
  return (
    <Button
      variant="secondary"
      className="btn-full-width"
      onClick={() => {
        onClickTrigger();
        incrementValue();
      }}
    >
      Update Context (Current: {value})
    </Button>
  );
}

function TreeCanvas({
  dataProp,
  actionProp,
  isMemoEnabled,
  registerRender,
  renderStats,
  selectedId,
  onSelect,
  parentState,
  onUpdateParentState,
  childAUpdateSignal,
}) {
  const appStats = renderStats.App;

  return (
    <div className="tree-canvas panel">
      <div className="tree-level">
        <div
          className={`tree-node tree-node--root ${selectedId === 'App' ? 'selected' : ''} ${nodeStateClass(appStats)}`}
          onClick={() => onSelect('App')}
        >
          <div className="node-title">
            <span>App (Visualizer)</span>
            <span className="badge">Root</span>
          </div>
          <div className="node-stat">Renders: <strong>{appStats.count}</strong></div>
          <div className="node-stat">Time: {appStats.timestamp ? `${appStats.timestamp.toFixed(1)} ms` : '—'}</div>
          <div className={`node-reason ${appStats.status === 'skipped' ? 'skipped-reason' : ''}`}>
            {appStats.status === 'skipped' ? 'Skipped (Bailout)' : appStats.reason}
          </div>
        </div>
      </div>

      <div className={`tree-connector tree-connector--vertical ${flowClass(appStats.status)}`} />

      <div className="tree-level-stack">
        <ParentComponent
          dataProp={dataProp}
          actionProp={actionProp}
          isMemoEnabled={isMemoEnabled}
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={onSelect}
          parentState={parentState}
          onUpdateParentState={onUpdateParentState}
          childAUpdateSignal={childAUpdateSignal}
        />

        <div className={`tree-connector tree-connector--vertical ${flowClass(renderStats.ContextConsumer.status)}`} />

        <ContextConsumerComponent
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

function WhyDidItRenderPanel({ selectedId, stats }) {
  if (!selectedId) {
    return (
      <div className="diag-empty">
        Click on any component card in the tree visualizer to analyze its render triggers.
      </div>
    );
  }

  const compStats = stats[selectedId];
  if (!compStats) return null;

  const didRender = compStats.status === 'rendered';
  const isSkipped = compStats.status === 'skipped';

  let bailoutExplanation = null;
  if (isSkipped) {
    if (selectedId === 'ChildB') {
      bailoutExplanation = 'React.memo performed shallow props comparison and bypassed this component tree completely since references were stable.';
    } else if (selectedId === 'ContextConsumer') {
      bailoutExplanation = 'ContextConsumer did not render because the shared context value did not change, and no state update was scheduled in its parent tree.';
    } else if (selectedId === 'Parent') {
      bailoutExplanation = 'Parent was skipped because the React Context update bypassed the DOM tree container (Standard layout optimization).';
    } else {
      bailoutExplanation = 'Reconciliation skipped. The parent rendering sequence was bypassed (e.g. via React.memo) or did not schedule updates.';
    }
  }

  const lifecycleClass = didRender
    ? 'detail-val--rendered'
    : isSkipped
      ? 'detail-val--skipped'
      : 'detail-val--idle';

  return (
    <div className="diag-timeline">
      <div className="detail-row">
        <span className="detail-label">Selected Node:</span>
        <span className="detail-val detail-val--highlight">{selectedId}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Last Lifecycle Action:</span>
        <span className={`detail-val ${lifecycleClass}`}>
          {didRender ? 'RENDERED' : isSkipped ? 'SKIPPED (BAILOUT)' : 'IDLE'}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Render Cycle Count:</span>
        <span className="detail-val">{compStats.count}</span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Timestamp:</span>
        <span className="detail-val">{compStats.timestamp ? `${compStats.timestamp.toFixed(1)} ms` : '—'}</span>
      </div>

      <h4 className="diag-section-title">Trigger Diagnostics</h4>

      <div className="detail-row">
        <span className="detail-label">State Updated:</span>
        <span className={`detail-val ${compStats.changedState ? 'yes' : 'no'}`}>
          {compStats.changedState ? 'Yes' : 'No'}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Props Updated:</span>
        <span className={`detail-val ${compStats.changedProps && compStats.changedProps.length > 0 ? 'yes' : 'no'}`}>
          {compStats.changedProps && compStats.changedProps.length > 0 ? 'Yes' : 'No'}
        </span>
      </div>

      {compStats.changedProps && compStats.changedProps.length > 0 && (
        <div className="comparison-box">
          {compStats.changedProps.map((p) => (
            <div key={p.key} className="comparison-prop">
              <div>Prop key: <strong className="comparison-prop__key">{p.key}</strong></div>
              <div className="comparison-prop__meta">
                Changed by reference ({p.type})
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="detail-row">
        <span className="detail-label">Context Updated:</span>
        <span className={`detail-val ${compStats.changedContext ? 'yes' : 'no'}`}>
          {compStats.changedContext ? 'Yes' : 'No'}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">Forced Parent Render:</span>
        <span className={`detail-val ${didRender && !compStats.changedState && !compStats.changedContext && (!compStats.changedProps || compStats.changedProps.length === 0) ? 'yes' : 'no'}`}>
          {didRender && !compStats.changedState && !compStats.changedContext && (!compStats.changedProps || compStats.changedProps.length === 0) ? 'Yes' : 'No'}
        </span>
      </div>

      {isSkipped && bailoutExplanation && (
        <div className="comparison-box comparison-box--bailout">
          <strong className="comparison-box__title">RECONCILIATION BAILOUT:</strong>
          <p className="comparison-box__text">{bailoutExplanation}</p>
        </div>
      )}
    </div>
  );
}

function VisualizerDashboard() {
  const [selectedId, setSelectedId] = useState('Parent');
  const [pipelinePhase, setPipelinePhase] = useState('none');

  const [isMemoEnabled, setIsMemoEnabled] = useState(false);
  const [propType, setPropType] = useState('stable');
  const [callbackType, setCallbackType] = useState('stable');
  const [activeScenario, setActiveScenario] = useState('scenario1');

  const [parentState, setParentState] = useState(0);
  const [childAUpdateSignal, setChildAUpdateSignal] = useState(0);

  const stableObject = useMemo(() => ({ value: 42 }), []);
  const stableCallback = useCallback(() => { /* Action triggered */ }, []);

  const dataProp = propType === 'stable' ? stableObject : { value: 42 };
  const actionProp = callbackType === 'stable' ? stableCallback : () => { /* Inline Callback */ };

  const context = useContext(VisualizerContext);

  const [renderStats, setRenderStats] = useState({
    App: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
    Parent: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
    ChildA: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
    ChildB: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
    ChildC: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
    ContextConsumer: { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' },
  });

  const accumulatedStats = useRef({});
  const [activeTransactionId, setActiveTransactionId] = useState(0);

  const registerRender = useCallback((id, details) => {
    accumulatedStats.current[id] = {
      ...details,
      transactionId: activeTransactionId,
    };
  }, [activeTransactionId]);

  useRenderDiagnostics(
    'App',
    null,
    null,
    context.value,
    registerRender,
  );

  const runRenderTimeline = useCallback((triggerAction) => {
    setRenderStats((prev) => {
      const next = {};
      for (const key of Object.keys(prev)) {
        next[key] = { ...prev[key], status: 'pending' };
      }
      return next;
    });

    setActiveTransactionId((prev) => prev + 1);
    accumulatedStats.current = {};

    setPipelinePhase('state');
    setTimeout(() => setPipelinePhase('scheduler'), 150);
    setTimeout(() => setPipelinePhase('render'), 300);
    setTimeout(() => setPipelinePhase('reconciliation'), 450);
    setTimeout(() => {
      setPipelinePhase('commit');
      triggerAction();
    }, 600);
    setTimeout(() => setPipelinePhase('none'), 1200);
  }, []);

  useEffect(() => {
    if (activeTransactionId > 0) {
      const frameId = requestAnimationFrame(() => {
        setRenderStats((prev) => {
          const next = {};
          const ids = ['App', 'Parent', 'ChildA', 'ChildB', 'ChildC', 'ContextConsumer'];

          for (const id of ids) {
            const acc = accumulatedStats.current[id];
            const prevStat = prev[id];

            if (acc && acc.transactionId === activeTransactionId) {
              next[id] = {
                count: acc.count,
                timestamp: acc.timestamp,
                reason: acc.reason,
                status: 'rendered',
                changedProps: acc.changedProps,
                changedState: acc.changedState,
                changedContext: acc.changedContext,
                props: acc.props,
                state: acc.state,
                context: acc.context,
              };
            } else {
              next[id] = {
                count: prevStat ? prevStat.count : 0,
                timestamp: prevStat ? prevStat.timestamp : null,
                reason: id === 'ChildB' && isMemoEnabled ? 'React.memo bailout (props identical)' : prevStat ? prevStat.reason : 'Skipped',
                status: 'skipped',
                changedProps: [],
                changedState: false,
                changedContext: false,
                props: prevStat ? prevStat.props : null,
                state: prevStat ? prevStat.state : null,
                context: prevStat ? prevStat.context : null,
              };
            }
          }
          return next;
        });
      });
      return () => cancelAnimationFrame(frameId);
    }
    return undefined;
  }, [activeTransactionId, isMemoEnabled]);

  const applyScenario = (id) => {
    setActiveScenario(id);
    switch (id) {
      case 'scenario1':
        setIsMemoEnabled(false);
        setPropType('stable');
        setCallbackType('stable');
        break;
      case 'scenario2':
        setIsMemoEnabled(true);
        setPropType('stable');
        setCallbackType('stable');
        break;
      case 'scenario3':
        setIsMemoEnabled(true);
        setPropType('inline');
        setCallbackType('stable');
        break;
      case 'scenario4':
        setIsMemoEnabled(true);
        setPropType('stable');
        setCallbackType('stable');
        break;
      case 'scenario5':
        setIsMemoEnabled(true);
        setPropType('stable');
        setCallbackType('inline');
        break;
      case 'scenario6':
        setIsMemoEnabled(true);
        setPropType('stable');
        setCallbackType('stable');
        break;
      case 'scenario7':
      case 'scenario8':
        setIsMemoEnabled(true);
        setPropType('stable');
        setCallbackType('stable');
        break;
      default:
        break;
    }
  };

  const handleActionClick = (type) => {
    if (type === 'parent') {
      runRenderTimeline(() => setParentState((s) => s + 1));
    } else if (type === 'context') {
      runRenderTimeline(() => {});
    } else if (type === 'childA') {
      runRenderTimeline(() => setChildAUpdateSignal((s) => s + 1));
    }
  };

  return (
    <div className="visualizer-wrapper">
      <aside className="panel visualizer-area-sidebar">
        <h3 className="panel-title">Scenarios</h3>
        <div className="button-group">
          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario1' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario1')}
          >
            <h4>1. Parent State Update</h4>
            <p>Parent renders without memo. All children render recursively.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario2' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario2')}
          >
            <h4>2. React.memo</h4>
            <p>ChildB uses React.memo. Stable props cause ChildB to skip render.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario3' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario3')}
          >
            <h4>3. Object Identity Problem</h4>
            <p>Fresh object reference is created on render. React.memo fails.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario4' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario4')}
          >
            <h4>4. useMemo Fix</h4>
            <p>Object wrapped in useMemo maintains identity, React.memo bails out.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario5' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario5')}
          >
            <h4>5. Callback Identity Problem</h4>
            <p>Inline function recreation causes React.memo props check to fail.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario6' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario6')}
          >
            <h4>6. useCallback Fix</h4>
            <p>Stable callback prevents ChildB re-renders.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario7' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario7')}
          >
            <h4>7. Context Update</h4>
            <p>Context updates bypass React.memo and force consumers to render.</p>
          </button>

          <button
            type="button"
            className={`scenario-card ${activeScenario === 'scenario8' ? 'active' : ''}`}
            onClick={() => applyScenario('scenario8')}
          >
            <h4>8. Local State Update</h4>
            <p>Updates ChildA state. Subtree siblings and parent skip rendering.</p>
          </button>
        </div>

        <h3 className="panel-title panel-title--spaced">Interactive Config</h3>
        <div className="config-group">
          <label className="toggle-switch">
            <span>Toggle React.memo (Child B)</span>
            <span className="switch-control">
              <input
                type="checkbox"
                checked={isMemoEnabled}
                onChange={(e) => setIsMemoEnabled(e.target.checked)}
              />
              <span className="slider" />
            </span>
          </label>

          <label className="toggle-switch">
            <span>Pass Stable Object (useMemo)</span>
            <span className="switch-control">
              <input
                type="checkbox"
                checked={propType === 'stable'}
                onChange={(e) => setPropType(e.target.checked ? 'stable' : 'inline')}
              />
              <span className="slider" />
            </span>
          </label>

          <label className="toggle-switch">
            <span>Pass Stable Callback (useCallback)</span>
            <span className="switch-control">
              <input
                type="checkbox"
                checked={callbackType === 'stable'}
                onChange={(e) => setCallbackType(e.target.checked ? 'stable' : 'inline')}
              />
              <span className="slider" />
            </span>
          </label>

          <div className="action-buttons">
            <Button className="btn-full-width" onClick={() => handleActionClick('parent')}>
              Update Parent State
            </Button>
            <Button className="btn-full-width" variant="secondary" onClick={() => handleActionClick('childA')}>
              Update ChildA State
            </Button>
            <ContextUpdateButton onClickTrigger={() => handleActionClick('context')} />
          </div>
        </div>
      </aside>

      <div className="visualizer-area-main">
        <div className="panel visualizer-header">
          <div>
            <h2 className="visualizer-header__title">Rendering Architecture Visualizer</h2>
            <p className="visualizer-header__subtitle">Select components to analyze fiber details</p>
          </div>
          <div className="visualizer-legend">
            <span className="visualizer-legend__item">
              <span className="visualizer-legend__dot visualizer-legend__dot--rendered" />
              Rendered
            </span>
            <span className="visualizer-legend__item">
              <span className="visualizer-legend__dot visualizer-legend__dot--skipped" />
              Skipped (Bailout)
            </span>
          </div>
        </div>

        <TreeCanvas
          dataProp={dataProp}
          actionProp={actionProp}
          isMemoEnabled={isMemoEnabled}
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={setSelectedId}
          parentState={parentState}
          onUpdateParentState={() => handleActionClick('parent')}
          childAUpdateSignal={childAUpdateSignal}
        />

        <div className="visualizer-diagnostics-stack">
          <div className="panel">
            <h3 className="panel-title">Why Did This Render?</h3>
            <WhyDidItRenderPanel selectedId={selectedId} stats={renderStats} />
          </div>

          <div className="panel">
            <h3 className="panel-title">React Rendering Pipeline</h3>
            <ArchitectureDiagram activePhase={pipelinePhase} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RenderingVisualizer() {
  return (
    <VisualizerContextProvider>
      <VisualizerDashboard />
    </VisualizerContextProvider>
  );
}
