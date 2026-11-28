import './Slash.css';

export default function Slash({
  size = 72,
  animated = true,
  className = '',
  alt = 'Slash, AtLa/BTS AI Success Manager',
  loading,
}) {
  return (
    <span
      className={`slash-bot ${animated ? 'is-animated' : ''} ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <picture>
        <source srcSet="/slash.webp" type="image/webp" />
        <img
          src="/slash.png"
          alt={alt}
          width={size}
          height={size}
          loading={loading}
          decoding="async"
        />
      </picture>
    </span>
  );
}
