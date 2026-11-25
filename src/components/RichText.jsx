export default function RichText({ parts }) {
  if (!Array.isArray(parts)) {
    return <>{parts}</>;
  }
  return (
    <>
      {parts.map((part, idx) =>
        typeof part === 'string' ? (
          <span key={idx}>{part}</span>
        ) : part?.bold ? (
          <strong key={idx}>{part.text}</strong>
        ) : (
          <span key={idx}>{part?.text}</span>
        )
      )}
    </>
  );
}

