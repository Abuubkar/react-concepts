import { useDeferredValue, useState } from 'react';
import ExpensiveList from './ExpensiveList';
import Input from '../../components/Input';

export default function UseDeferredValueExample() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div className="example-content">
      <h2>useDeferredValue demo</h2>

      <p className="example-copy">
        This example shows how <strong>useDeferredValue</strong> keeps the input responsive while a heavy list renders.
      </p>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type quickly..."
      />

      <p className="example-meta">
        Input value: <strong>{query || '—'}</strong>
      </p>
      <p>
        Deferred value: <strong>{deferredQuery || '—'}</strong>
      </p>

      <ExpensiveList query={deferredQuery} />
    </div>
  );
}
