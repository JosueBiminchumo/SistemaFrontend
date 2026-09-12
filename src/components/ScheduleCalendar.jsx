import { weekDays } from '../pages/doctor/doctorStorage';

export default function ScheduleCalendar({ slots, onDelete }) {
  const slotsByDay = weekDays.map((day) => ({
    day,
    items: slots.filter((slot) => slot.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="schedule-calendar">
      {slotsByDay.map(({ day, items }) => (
        <div key={day} className="schedule-calendar__day">
          <div className="schedule-calendar__day-header">{day}</div>

          {items.length === 0 ? (
            <p className="schedule-calendar__empty">Sin horarios</p>
          ) : (
            <ul className="schedule-calendar__slots">
              {items.map((slot) => (
                <li key={slot.id} className="schedule-slot">
                  <span>{slot.startTime} - {slot.endTime}</span>
                  <button
                    type="button"
                    className="schedule-slot__delete"
                    onClick={() => onDelete(slot.id)}
                    aria-label={`Eliminar horario ${slot.startTime} a ${slot.endTime} del ${day}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}