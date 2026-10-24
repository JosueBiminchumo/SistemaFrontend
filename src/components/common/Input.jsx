import './Input.css';

function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
}) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export default Input;
