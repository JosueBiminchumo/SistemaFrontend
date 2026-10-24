import { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  Bone,
  Brain,
  Eye,
  HeartPulse,
  Pencil,
  Plus,
  Shield,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';

import {
  createSpecialty,
  deactivateSpecialty,
  getSpecialtiesWithDoctorCount,
  updateSpecialty,
} from '../../services/specialtyService';
import './SpecialtiesManagementPage.css';

const specialtyIcons = {
  heart: HeartPulse,
  sparkles: Sparkles,
  brain: Brain,
  baby: Baby,
  bone: Bone,
  stethoscope: Stethoscope,
  shield: Shield,
  eye: Eye,
};

const emptyForm = {
  name: '',
  description: '',
};

export default function SpecialtiesManagementPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    getSpecialtiesWithDoctorCount()
      .then((items) => alive && setSpecialties(items))
      .catch((err) => alive && setLoadError(err.message || 'No se pudieron cargar las especialidades.'))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const filteredSpecialties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return specialties;
    }

    return specialties.filter(
      (specialty) =>
        specialty.name.toLowerCase().includes(searchValue) ||
        specialty.description.toLowerCase().includes(searchValue),
    );
  }, [search, specialties]);

  const openNewModal = () => {
    setSelectedSpecialty(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (specialty) => {
    setSelectedSpecialty(specialty);
    setForm({
      name: specialty.name,
      description: specialty.description,
    });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSpecialty(null);
    setForm(emptyForm);
    setError('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError('El nombre de la especialidad es obligatorio.');
      return;
    }

    const duplicatedName = specialties.some(
      (specialty) =>
        specialty.name.toLowerCase() === name.toLowerCase() &&
        specialty.id !== selectedSpecialty?.id,
    );

    if (duplicatedName) {
      setError('Ya existe una especialidad con ese nombre.');
      return;
    }

    setSaving(true);

    try {
      if (selectedSpecialty) {
        const updated = await updateSpecialty(selectedSpecialty.id, {
          name,
          description,
          active: selectedSpecialty.active,
        });

        setSpecialties((currentSpecialties) =>
          currentSpecialties.map((specialty) =>
            specialty.id === updated.id
              ? { ...updated, doctors: specialty.doctors }
              : specialty,
          ),
        );
      } else {
        const created = await createSpecialty({ name, description, active: true });

        setSpecialties((currentSpecialties) => [...currentSpecialties, created]);
      }

      closeModal();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la especialidad.');
    } finally {
      setSaving(false);
    }
  };

  // Desactivar usa DELETE (baja lógica); reactivar usa PUT con active=true.
  const toggleStatus = async (specialtyId) => {
    const specialty = specialties.find((item) => item.id === specialtyId);

    if (!specialty) {
      return;
    }

    try {
      if (specialty.active) {
        await deactivateSpecialty(specialty.id);
      } else {
        await updateSpecialty(specialty.id, {
          name: specialty.name,
          description: specialty.description,
          active: true,
        });
      }

      setSpecialties((currentSpecialties) =>
        currentSpecialties.map((item) =>
          item.id === specialtyId ? { ...item, active: !item.active } : item,
        ),
      );
    } catch (err) {
      window.alert(err.message || 'No se pudo cambiar el estado de la especialidad.');
    }
  };

  return (
    <main className="specialties-page">
      <header className="specialties-page__header">
        <div>
          <h1>Gestión de especialidades</h1>
          <p>{specialties.length} especialidades registradas</p>
        </div>

        <button
          type="button"
          className="specialties-page__new-button"
          onClick={openNewModal}
        >
          <Plus size={17} />
          Nueva especialidad
        </button>
      </header>

      <label className="specialties-page__search">
        <Stethoscope size={18} />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar especialidad..."
        />
      </label>

      {filteredSpecialties.length === 0 ? (
        <div className="specialties-page__empty">
          {loading
            ? 'Cargando especialidades...'
            : loadError || 'No se encontraron especialidades.'}
        </div>
      ) : (
        <section className="specialties-grid">
          {filteredSpecialties.map((specialty) => {
            const SpecialtyIcon =
              specialtyIcons[specialty.icon] ?? Stethoscope;

            return (
              <article
                key={specialty.id}
                className={`specialty-card ${
                  !specialty.active ? 'specialty-card--inactive' : ''
                }`}
              >
                <div className="specialty-card__top">
                  <div className="specialty-card__icon">
                    <SpecialtyIcon size={21} />
                  </div>

                  <span
                    className={`specialty-card__status ${
                      specialty.active
                        ? 'specialty-card__status--active'
                        : 'specialty-card__status--inactive'
                    }`}
                  >
                    {specialty.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <h2>{specialty.name}</h2>
                <p>{specialty.description}</p>

                <strong>
                  {specialty.doctors}{' '}
                  {specialty.doctors === 1 ? 'médico' : 'médicos'}
                </strong>

                <div className="specialty-card__divider" />

                <div className="specialty-card__actions">
                  <button
                    type="button"
                    className="specialty-card__edit"
                    onClick={() => openEditModal(specialty)}
                  >
                    <Pencil size={15} />
                    Editar
                  </button>

                  <button
                    type="button"
                    className="specialty-card__toggle"
                    onClick={() => toggleStatus(specialty.id)}
                    aria-label={
                      specialty.active
                        ? `Desactivar ${specialty.name}`
                        : `Activar ${specialty.name}`
                    }
                    title={
                      specialty.active
                        ? 'Desactivar especialidad'
                        : 'Activar especialidad'
                    }
                  >
                    {specialty.active ? '×' : '✓'}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {modalOpen && (
        <div
          className="specialty-modal"
          role="presentation"
          onMouseDown={closeModal}
        >
          <section
            className="specialty-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="specialty-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="specialty-modal__header">
              <h2 id="specialty-modal-title">
                {selectedSpecialty
                  ? 'Editar especialidad'
                  : 'Nueva especialidad'}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Cerrar formulario"
              >
                <X size={19} />
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="specialty-modal__body">
                <label>
                  Nombre <span>*</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Ejemplo: Cardiología"
                    maxLength={80}
                  />
                </label>

                <label>
                  Descripción
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Describe el área de atención"
                    maxLength={180}
                    rows={3}
                  />
                </label>

                {error && (
                  <p className="specialty-modal__error">{error}</p>
                )}
              </div>

              <footer className="specialty-modal__footer">
                <button
                  type="button"
                  className="specialty-modal__cancel"
                  onClick={closeModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="specialty-modal__save"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}