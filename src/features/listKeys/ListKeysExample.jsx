import { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';

let nextId = 4;

export default function ListKeysExample() {
  const [items, setItems] = useState([
    { id: 'id-1', label: 'Item A' },
    { id: 'id-2', label: 'Item B' },
    { id: 'id-3', label: 'Item C' },
  ]);

  const handlePrepend = () => {
    const currentId = nextId++;
    setItems([
      { id: `id-${currentId}`, label: `Item ${String.fromCharCode(64 + currentId) || '#' + currentId}` },
      ...items,
    ]);
  };

  const handleAppend = () => {
    const currentId = nextId++;
    setItems([
      ...items,
      { id: `id-${currentId}`, label: `Item ${String.fromCharCode(64 + currentId) || '#' + currentId}` },
    ]);
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSortAsc = () => {
    setItems([...items].sort((a, b) => a.label.localeCompare(b.label)));
  };

  const handleSortDesc = () => {
    setItems([...items].sort((a, b) => b.label.localeCompare(a.label)));
  };

  const handleReset = () => {
    setItems([
      { id: 'id-1', label: 'Item A' },
      { id: 'id-2', label: 'Item B' },
      { id: 'id-3', label: 'Item C' },
    ]);
  };

  return (
    <div className="example-content">
      <h2>List Keys Comparison</h2>

      <p className="example-copy">
        Demonstrates how React tracks list items using keys. 
        <strong> Instructions:</strong> Type unique text into the input fields of each item below, then use the controls to prepend, append, or sort. Observe how local input state behaves across the three strategies.
      </p>

      <div className="example-actions" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '12px' }}>
        <Button onClick={handlePrepend}>
          Prepend Item
        </Button>
        <Button onClick={handleAppend}>
          Append Item
        </Button>
        <Button variant="secondary" onClick={handleSortAsc}>
          Sort ASC ↑
        </Button>
        <Button variant="secondary" onClick={handleSortDesc}>
          Sort DESC ↓
        </Button>
        <Button variant="secondary" style={{ borderColor: 'var(--accent)' }} onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '12px' }}>
        {/* Column 1: Without Keys */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', background: 'rgba(255,0,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 6px 0', color: 'var(--text-h)' }}>1. Without Keys</h3>
          <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: 'var(--text)' }}>Position-based matching. Re-renders everything on change. Prints console warning.</p>
          <div style={{ display: 'grid', gap: '6px' }}>
            {items.map((item) => (
              /* eslint-disable-next-line react/jsx-key */
              <ListItemRow label={item.label} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        </div>

        {/* Column 2: Index as Key */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', background: 'rgba(255,165,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 6px 0', color: 'var(--text-h)' }}>2. Index as Key</h3>
          <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: 'var(--text)' }}>Key tied to order (`0, 1, 2...`). Local state stays with index, mismatching data on prepend/sort.</p>
          <div style={{ display: 'grid', gap: '6px' }}>
            {items.map((item, index) => (
              <ListItemRow key={index} label={item.label} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        </div>

        {/* Column 3: ID as Key */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', background: 'rgba(0,128,0,0.02)' }}>
          <h3 style={{ fontSize: '15px', margin: '0 0 6px 0', color: 'var(--text-h)' }}>3. Unique ID as Key</h3>
          <p style={{ fontSize: '12px', margin: '0 0 12px 0', color: 'var(--text)' }}><strong>Correct approach.</strong> Key stays with item identity. Local state correctly moves with the item.</p>
          <div style={{ display: 'grid', gap: '6px' }}>
            {items.map((item) => (
              <ListItemRow key={item.id} label={item.label} onRemove={() => handleRemove(item.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListItemRow({ label, onRemove }) {
  const [localValue, setLocalValue] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'between',
        gap: '8px',
        padding: '6px 10px',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        background: 'var(--bg)',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </span>
      <Input
        type="text"
        style={{
          padding: '4px 8px',
          fontSize: '13px',
          height: '28px',
          minHeight: 'unset',
          flex: 1,
        }}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="State note..."
      />
      <Button
        variant="secondary"
        style={{
          padding: '0 6px',
          minHeight: 'unset',
          height: '28px',
          fontSize: '12px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onClick={onRemove}
        title="Remove item"
      >
        ✕
      </Button>
    </div>
  );
}
