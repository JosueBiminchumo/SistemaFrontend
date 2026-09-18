import { useState } from 'react';
import { weekDays } from '../pages/doctor/doctorStorage';

export default function ScheduleForm({ onAdd, onCancel }) {
  const [day, setDay] = useState(weekDays[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!startTime || !endTime) {
      setError('Debes indicar hora de inicio y hora de fin.');
      return;
    }

    if (startTime >= endTime) {
      setError('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    onAdd({ day, startTime, endTime });
    setStartTime('');
    setEndTime('');
  };

  return (
    <form className="schedule-form" onSubmit={handleSubmit}>
      <h3 className="schedule-form__title">Agregar horario disponible</h3>

      {error && <div className="schedule-form__error">{error}</div>}

      <div className="schedule-form__row">
        <div className="schedule-form__field">
          <label htmlFor="day">Día</label>
          <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
            {weekDays.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="schedule-form__field">
          <label htmlFor="startTime">Desde</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="schedule-form__field">
          <label htmlFor="endTime">Hasta</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="schedule-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary">
          Guardar horario
        </button>
      </div>
    </form>
  );
}