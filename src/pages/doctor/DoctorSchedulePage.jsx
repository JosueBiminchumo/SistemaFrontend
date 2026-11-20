import { useEffect, useState } from 'react';
import ScheduleCalendar from '../../components/ScheduleCalendar';
import ScheduleForm from '../../components/ScheduleForm';
import { getMySchedule, replaceMySchedule } from '../../services/doctorService';
import { dayToWeekday, weekdayToDay } from './doctorScheduleConstants';
import DoctorLayout from './DoctorLayout';
import './DoctorSchedulePage.css';

function mapScheduleEntry(entry) {
  return {
    id: entry.id,
    day: weekdayToDay[entry.dayOfWeek],
    startTime: entry.startTime.slice(0, 5),
    endTime: entry.endTime.slice(0, 5),
    slotMinutes: entry.slotMinutes,
  };
}

function toApiSchedule(slots) {
  return slots.map((slot) => ({
    dayOfWeek: dayToWeekday[slot.day],
    startTime: `${slot.startTime}:00`,
    endTime: `${slot.endTime}:00`,
    slotMinutes: slot.slotMinutes,
  }));
}

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshSchedule = async () => {
    const schedule = await getMySchedule();
    setSlots(schedule.map(mapScheduleEntry));
  };

  useEffect(() => {
    getMySchedule()
      .then((schedule) => setSlots(schedule.map(mapScheduleEntry)))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (newSlot) => {
    const hasOverlap = slots.some(
      (slot) => slot.day === newSlot.day
        && newSlot.startTime < slot.endTime
        && newSlot.endTime > slot.startTime,
    );

    if (hasOverlap) {
      setError('Ese horario se cruza con uno ya existente para ese día.');
      return;
    }

    setError('');
    try {
      await replaceMySchedule(toApiSchedule([...slots, newSlot]));
      await refreshSchedule();
      setShowForm(false);
      setFeedback('Horario guardado en la base de datos.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await replaceMySchedule(toApiSchedule(slots.filter((slot) => slot.id !== id)));
      await refreshSchedule();
      setFeedback('Horario eliminado de la base de datos.');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <DoctorLayout>
      <div className="doctor-schedule">
        <header className="doctor-schedule__header">
          <div>
            <h1>Mi agenda</h1>
            <p className="doctor-schedule__subtitle">Gestiona tus horarios disponibles por semana</p>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            + Agregar horario
          </button>
        </header>

        {feedback && <div className="doctor-schedule__feedback">{feedback}</div>}
        {error && <p role="alert">{error}</p>}
        {showForm && <ScheduleForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}
        {loading ? (
          <p role="status">Cargando agenda...</p>
        ) : (
          <ScheduleCalendar slots={slots} onDelete={handleDelete} />
        )}
      </div>
    </DoctorLayout>
  );
}
