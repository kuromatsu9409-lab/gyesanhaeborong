type ResultCardProps = {
  value: string;
  caption: string;
  detail?: string;
};

export function ResultCard({ value, caption, detail }: ResultCardProps) {
  return (
    <div className="result-card" aria-live="polite" aria-atomic="true">
      <div className="result-card__value">{value}</div>
      <div className="result-card__caption">{caption}</div>
      {detail && <div className="result-card__detail">{detail}</div>}
    </div>
  );
}
