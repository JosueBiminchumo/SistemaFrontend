import { useEffect, useState } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import ScheduleForm from '../../components/ScheduleForm';
import { getSchedule, saveSchedule } from './doctorApi';
import DoctorLayout from './DoctorLayout';
import './DoctorSchedulePage.css';

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let alive = true;
    getSchedule()
      .then((rules) => alive && setSlots(rules))
      .catch((err) => alive && setErrorMessage(err.message || 'No se pudo cargar tu agenda.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  // El backend reemplaza toda la agenda semanal en cada guardado.
  const persist = async (updated, successMessage) => {
    setSaving(true);
    setErrorMessage('');
    try {
      const saved = await saveSchedule(updated);
      setSlots(saved);
      if (successMessage) {
        setFeedback(successMessage);
        setTimeout(() => setFeedback(''), 2500);
      }
      return true;
    } catch (err) {
      setErrorMessage(err.message || 'No se pudo guardar la agenda.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (newSlot) => {
    const hasOverlap = slots.some(
      (slot) =>
        slot.active !== false &&
        slot.day === newSlot.day &&
        newSlot.startTime < slot.endTime &&
        newSlot.endTime > slot.startTime
    );

    if (hasOverlap) {
      setErrorMessage('Ese horario se cruza con uno ya existente para ese día.');
      return;
    }

    const ok = await persist([...slots, newSlot], 'Horario agregado correctamente.');
    if (ok) setShowForm(false);
  };

  const handleDelete = (id) => {
    persist(slots.filter((slot) => slot.id !== id), 'Horario eliminado.');
  };

  return (
    <DoctorLayout>
      <div className="doctor-schedule">
        <header className="doctor-schedule__header">
          <div>
            <h1>Mi agenda</h1>
            <p className="doctor-schedule__subtitle">Gestiona tus horarios disponibles por semana</p>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)} disabled={loading || saving}>
            + Agregar horario
          </button>
        </header>

        {feedback && <div className="doctor-schedule__feedback">{feedback}</div>}
        {errorMessage && <div className="doctor-schedule__feedback" role="alert">{errorMessage}</div>}

        {showForm && <ScheduleForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}

        {loading ? <p className="doctor-schedule__subtitle">Cargando agenda...</p> : (
          <ScheduleCalendar slots={slots} onDelete={handleDelete} />
        )}
      </div>
    </DoctorLayout>
  );
}
