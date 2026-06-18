export default function ExpensiveList({ query }) {
  const items = [];

  for (let i = 0; i < 20000; i++) {
    let value = 0;

    for (let j = 0; j < 500; j++) {
      value += Math.sqrt(j);
    }

    items.push(
      <div key={i} data-work={value}>
        {query} #{i}
      </div>
    );
  }

  return (
    <div id="expensive-list">
      {items}
    </div>
  );
}
