import { useMemo } from 'react';
import './App.css';
import useQueryState from './hooks/useQueryState';
import { featureList, defaultFeatureId } from './config/features';

export default function App() {
  const [selectedFeature, setSelectedFeature] = useQueryState(
    'feature',
    defaultFeatureId,
    (val) => featureList.some((f) => f.id === val)
  );

  const activeFeature = useMemo(
    () => featureList.find((feature) => feature.id === selectedFeature),
    [selectedFeature],
  );

  const ActiveComponent = activeFeature?.Component;
  const isWideFeature = selectedFeature === 'renderingVisualizer';

  return (
    <main className={`app-shell${isWideFeature ? ' app-shell--wide' : ''}`}>
      <header className="app-header">
        <div>
          <p className="app-kicker">React practice lab</p>
          <h1>React feature examples</h1>
        </div>

        <label className="feature-picker">
          <span>Pick a live example</span>
          <select
            value={selectedFeature}
            onChange={(event) => setSelectedFeature(event.target.value)}
          >
            {featureList.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className={`feature-panel${isWideFeature ? ' feature-panel--wide' : ''}`} aria-live="polite">
        {ActiveComponent ? <ActiveComponent /> : <p>Select a feature to see the example.</p>}
      </section>
    </main>
  );
}
