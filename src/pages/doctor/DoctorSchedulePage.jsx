import { useState } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import ScheduleForm from '../../components/ScheduleForm';
import { initialScheduleSlots } from './doctorScheduleMock';
import './DoctorSchedulePage.css';

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState(initialScheduleSlots);
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

    setSlots((prev) => [...prev, { id: Date.now(), ...newSlot }]);
    setShowForm(false);
    setFeedback('Horario agregado correctamente.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleDelete = (id) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
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