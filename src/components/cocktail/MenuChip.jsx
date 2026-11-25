import Icon from '../Icon';
import './MenuChip.css';

export default function MenuChip({ item, selected, onToggle }) {
  return (
    <button
      type="button"
      className={`chip ${selected ? 'in' : ''}`}
      draggable
      aria-pressed={selected}
      style={{ '--c': item.c }}
      onClick={() => onToggle(item.id)}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.id);
      }}
    >
      <span className="sw" />
      <span>{item.n}</span>
      <span className="pr" aria-hidden="true">
        <Icon name="plus" color="#0fb5ad" wrap={false} />
      </span>
    </button>
  );
}

