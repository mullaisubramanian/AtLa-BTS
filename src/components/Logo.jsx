import './Logo.css';

export default function Logo({
  className = '',
  alt = 'AtLa/BTS logo',
  lazy = false,
}) {
  return (
    <div className={`logo-mark logo-slot ${className}`.trim()}>
      <img
        src="/logo.png"
        alt={alt}
        width="42"
        height="42"
        loading={lazy ? 'lazy' : undefined}
        decoding={lazy ? 'async' : undefined}
      />
    </div>
  );
}
