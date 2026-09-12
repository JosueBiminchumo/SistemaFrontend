import { useState } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import ScheduleForm from '../../components/ScheduleForm';
import { getSchedule, saveSchedule } from './doctorStorage';
import './DoctorSchedulePage.css';

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState(() => getSchedule());
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleAdd = (newSlot) => {
    const hasOverlap = slots.some(
      (slot) =>
        slot.day === newSlot.day &&
        newSlot.startTime < slot.endTime &&
        newSlot.endTime > slot.startTime
    );

    if (hasOverlap) {
      alert('Ese horario se cruza con uno ya existente para ese día.');
      return;
    }

    const updated = [...slots, { id: Date.now(), ...newSlot }];
    setSlots(updated);
    saveSchedule(updated);
    setShowForm(false);
    setFeedback('Horario agregado correctamente.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleDelete = (id) => {
    const updated = slots.filter((slot) => slot.id !== id);
    setSlots(updated);
    saveSchedule(updated);
  };

  return (
    <div className="doctor-schedule">
      <header className="doctor-schedule__header">
        <div>
          <h1>Mi agenda</h1>
          <p className="doctor-schedule__subtitle">Gestiona tus horarios disponibles por semana</p>
        </div>

        <button type="button" className="btn btn--primary" onClick={() => setShowForm(true)}>
          + Agregar horario
        </button>
      </header>

      {feedback && <div className="doctor-schedule__feedback">{feedback}</div>}

      {showForm && (
        <ScheduleForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <ScheduleCalendar slots={slots} onDelete={handleDelete} />
    </div>
  );
}