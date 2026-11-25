import Icon from '../Icon';
import './ResultCard.css';

export default function ResultCard({ item, onSelect }) {
  return (
    <button
      type="button"
      className="res-card"
      style={{ '--c': item.c }}
      onClick={onSelect}
    >
      <span className="ri">
        <Icon name={item.ic} color="#fff" wrap={false} />
      </span>
      <span className="rt">
        <small>{item.top}</small>
        <b>{item.n}</b>
        <span>{item.d}</span>
      </span>
      <span className="go">{item.go} →</span>
    </button>
  );
}

