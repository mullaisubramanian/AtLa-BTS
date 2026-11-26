import './Logo.css';

export default function Logo({ className = '', alt = 'AtLa/BTS logo' }) {
  return (
    <div className={`logo-mark logo-slot ${className}`.trim()}>
      <img src="/logo.png" alt={alt} />
    </div>
  );
}

