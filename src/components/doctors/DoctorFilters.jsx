const EMPTY_FILTERS = { name: '', specialty: '', availability: false };

const DoctorFilters = ({ filters, setFilters, specialties }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
  };

  const hasActiveFilters =
    filters.name !== '' || filters.specialty !== '' || filters.availability;

  return (
    <div className="p-4 mb-4 border rounded shadow-sm bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filtrar Médicos</h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={handleClear}
          disabled={!hasActiveFilters}
        >
          Limpiar filtros
        </button>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre..."
            className="form-control"
            value={filters.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <select
            name="specialty"
            className="form-select"
            value={filters.specialty}
            onChange={handleChange}
          >
            <option value="">Todas las especialidades</option>
            {specialties.map((spec, index) => (
              <option key={index} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <div className="form-check">
            <input
              type="checkbox"
              name="availability"
              className="form-check-input"
              id="availabilityCheck"
              checked={filters.availability}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="availabilityCheck">
              Solo disponibles ahora
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilters;