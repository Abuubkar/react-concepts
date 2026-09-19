import { useRef, useLayoutEffect } from 'react';

/**
 * A custom hook to trace rendering metrics. Diffing, ref tracking, and registry
 * side-effects are performed inside useLayoutEffect (Commit Phase) to remain
 * compatible with strict React Compiler rules.
 */
export default function useRenderDiagnostics(id, props, state, contextValue, registerRender) {
  const prevProps = useRef(props);
  const prevState = useRef(state);
  const prevContext = useRef(contextValue);
  const renderCount = useRef(0);
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    renderCount.current += 1;

    // Diff props, state, and context
    const changedProps = [];
    if (!isInitialMount.current && prevProps.current && props) {
      const allKeys = Array.from(new Set([...Object.keys(prevProps.current), ...Object.keys(props)]));
      for (const key of allKeys) {
        if (prevProps.current[key] !== props[key]) {
          changedProps.push({
            key,
            prev: prevProps.current[key],
            current: props[key],
            type: typeof props[key]
          });
        }
      }
    }

    const changedState = !isInitialMount.current && prevState.current !== state;
    const changedContext = !isInitialMount.current && prevContext.current !== contextValue;

    let reason = 'Parent rendered (forced recursion)';
    if (isInitialMount.current) {
      reason = 'Initial Mount';
      isInitialMount.current = false;
    } else if (changedState) {
      reason = 'State changed';
    } else if (changedContext) {
      reason = 'Context changed';
    } else if (changedProps.length > 0) {
      reason = `Props changed (${changedProps.map((p) => p.key).join(', ')})`;
    }

    // Register diagnostics
    registerRender(id, {
      count: renderCount.current,
      timestamp: performance.now(),
      reason,
      changedProps,
      changedState,
      changedContext,
      props: props ? { ...props } : null,
      state,
      context: contextValue,
      status: 'rendered'
    });

    // Save values for next render comparisons
    prevProps.current = props;
    prevState.current = state;
    prevContext.current = contextValue;
  }); // Runs on every commit
}
