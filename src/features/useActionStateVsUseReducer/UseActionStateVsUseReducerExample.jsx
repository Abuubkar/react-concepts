import { useReducer, useActionState } from 'react';
import Button from '../../components/Button';

function counterAction(state, action) {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export const UseActionStateVsUseReducerExample = () => {
  const [state, dispatch] = useReducer(counterAction, 0);
  const [actionState, setActionState] = useActionState(counterAction, 0);

  return (
    <div className="example-content">
      <h2>useActionState vs useReducer Comparison</h2>
      <p className="example-copy">
        Comparing standard state management hooks. React 19's <strong>useActionState</strong> is designed for asynchronous actions and transition states, while <strong>useReducer</strong> is a general-purpose state machine.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '12px' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', background: 'var(--bg)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: 'var(--text-h)' }}>useReducer</h3>
          <p style={{ margin: '0 0 16px 0' }}>Current Count: <strong>{state}</strong></p>
          <div className="example-actions">
            <Button variant="secondary" onClick={() => dispatch({ type: 'decrement' })}>-</Button>
            <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', background: 'var(--bg)' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: 'var(--text-h)' }}>useActionState</h3>
          <p style={{ margin: '0 0 16px 0' }}>Current Count: <strong>{actionState}</strong></p>
          <div className="example-actions">
            <Button variant="secondary" onClick={() => setActionState({ type: 'decrement' })}>-</Button>
            <Button onClick={() => setActionState({ type: 'increment' })}>+</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

