import './StatusToggle.css';

function StatusToggle({ activo, onChange, disabled = false, nombre = 'registro' }) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!activo);
    }
  };

  return (
    <div className="status-toggle">
      <button
        type="button"
        role="switch"
        aria-checked={activo}
        aria-label={`${activo ? 'Desactivar' : 'Activar'} ${nombre}`}
        className={`status-toggle__switch ${activo ? 'status-toggle__switch--on' : ''}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className="status-toggle__thumb" />
      </button>
      <span
        className={`status-toggle__label ${activo ? 'status-toggle__label--on' : ''}`}
      >
        {activo ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  );
}

export default StatusToggle;