export default function Eyebrow({ children, className = '' }) {
  const hasBrand = typeof children === 'string' && children.includes('AtLa/BTS');
  return (
    <span className={`eyebrow ${hasBrand ? 'eyebrow-brand' : ''} ${className}`.trim()}>
      {children}
    </span>
  );
}
