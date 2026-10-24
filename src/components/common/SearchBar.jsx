import './SearchBar.css';

function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="searchbar">
      <span className="searchbar-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="searchbar-input"
      />
    </div>
  );
}

export default SearchBar;