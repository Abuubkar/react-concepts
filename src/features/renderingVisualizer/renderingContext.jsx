import React, { createContext, useState, useCallback, useMemo } from 'react';

export const VisualizerContext = createContext({
  value: 0,
  setValue: () => {},
});

export function VisualizerContextProvider({ children }) {
  const [value, setValue] = useState(0);

  const incrementValue = useCallback(() => {
    setValue((v) => v + 1);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo(() => ({ value, incrementValue }), [value, incrementValue]);

  return (
    <VisualizerContext.Provider value={contextValue}>
      {children}
    </VisualizerContext.Provider>
  );
}
