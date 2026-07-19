type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className="number-field">
      <span className="number-field__label">{label}</span>
      <input
        className="number-field__input"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="숫자를 입력하세요"
      />
    </label>
  );
}
