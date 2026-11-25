import Icon from '../Icon';
import './PageTile.css';

export default function PageTile({ icon, color = '#0fb5ad', title, subtitle, onClick }) {
  return (
    <button
      type="button"
      className="page-tile"
      style={{ '--tq': color }}
      onClick={onClick}
    >
      <Icon name={icon} color={color} />
      <b>{title}</b>
      <span>{subtitle}</span>
    </button>
  );
}

