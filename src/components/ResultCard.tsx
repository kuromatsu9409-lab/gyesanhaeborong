type ResultCardProps = {
  value: string;
  caption: string;
};

export function ResultCard({ value, caption }: ResultCardProps) {
  return (
    <div className="result-card" aria-live="polite" aria-atomic="true">
      <div className="result-card__value">{value}</div>
      <div className="result-card__caption">{caption}</div>
    </div>
  );
}
