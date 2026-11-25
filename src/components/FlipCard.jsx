import './FlipCard.css';

export default function FlipCard({
  flipped,
  onFlip,
  color,
  className = '',
  front,
  back,
  ariaLabel,
}) {
  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className={`flip ${flipped ? 'on' : ''} ${className}`.trim()}
      style={{ '--c': color }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={ariaLabel}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
    >
      <div className="flip-in">
        <div className="face front">{front}</div>
        <div className="face back">{back}</div>
      </div>
    </div>
  );
}

