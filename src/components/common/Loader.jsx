import './Loader.css';

function Loader({ size = 'md', text = '' }) {
  return (
    <div className="loader-container">
      <div className={`loader loader-${size}`}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;