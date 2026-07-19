type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function NumberField({ label, value, onChange, placeholder = '숫자를 입력하세요' }: NumberFieldProps) {
  return (
    <label className="number-field">
      <span className="number-field__label">{label}</span>
      <input
        className="number-field__input"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
