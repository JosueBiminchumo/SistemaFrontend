import './Select.css';

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Selecciona una opción',
  error = '',
  required = false,
}) {
  return (
    <div className="select-group">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'select-error' : ''}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
}

export default Select;