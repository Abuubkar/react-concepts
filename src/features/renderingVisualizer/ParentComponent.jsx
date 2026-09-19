import { useContext } from 'react';
import useRenderDiagnostics from '../../hooks/useRenderDiagnostics';
import { VisualizerContext } from './renderingContext';
import { ChildA, ChildB, ChildBMemo, ChildC } from './ChildComponents';
import Button from '../../components/Button';

function formatTime(ts) {
  if (!ts) return '—';
  return `${ts.toFixed(1)} ms`;
}

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

export default function ParentComponent({
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
  const context = useContext(VisualizerContext);

  useRenderDiagnostics(
    'Parent',
    { dataProp, isMemoEnabled, parentState },
    null,
    context.value,
    registerRender,
  );

  const stats = renderStats.Parent || { count: 0, timestamp: null, reason: 'Initial Mount', status: 'idle' };
  const isSelected = selectedId === 'Parent';
  const TargetChildB = isMemoEnabled ? ChildBMemo : ChildB;

  return (
    <div className="parent-node-wrapper">
      <div
        className={`tree-node ${isSelected ? 'selected' : ''} ${nodeStateClass(stats)}`}
        onClick={(e) => { e.stopPropagation(); onSelect('Parent'); }}
      >
        <div className="node-title">
          <span>Parent Component</span>
          <span className="badge">Container</span>
        </div>

        <div className="node-stat">Renders: <strong>{stats.count}</strong></div>
        <div className="node-stat">Time: {formatTime(stats.timestamp)}</div>
        <div className={`node-reason ${stats.status === 'skipped' ? 'skipped-reason' : ''}`}>
          {stats.status === 'skipped' ? 'Skipped (Bailout)' : stats.reason}
        </div>

        <div style={{ marginTop: '8px' }}>
          <Button
            style={{ padding: '4px 8px', minHeight: 'unset', height: '24px', fontSize: '10px', width: '100%' }}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateParentState();
            }}
          >
            State +1 ({parentState})
          </Button>
        </div>
      </div>

      <div className={`tree-connector tree-connector--vertical ${flowClass(stats.status)}`} />

      <div className="tree-connector-row--children">
        <div className={`tree-connector tree-connector--vertical ${flowClass(renderStats.ChildA.status)}`} />
        <div className={`tree-connector tree-connector--vertical ${flowClass(renderStats.ChildB.status)}`} />
        <div className={`tree-connector tree-connector--vertical ${flowClass(renderStats.ChildC.status)}`} />
      </div>

      <div className="tree-level-children">
        <ChildA
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={onSelect}
          childAUpdateSignal={childAUpdateSignal}
        />
        <TargetChildB
          data={dataProp}
          onAction={actionProp}
          isMemoized={isMemoEnabled}
          contextValue={context.value}
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={onSelect}
        />
        <ChildC
          registerRender={registerRender}
          renderStats={renderStats}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
