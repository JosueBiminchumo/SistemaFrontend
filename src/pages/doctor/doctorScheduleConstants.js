export const weekDays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const dayToWeekday = {
  Lunes: 'MONDAY',
  Martes: 'TUESDAY',
  Miércoles: 'WEDNESDAY',
  Jueves: 'THURSDAY',
  Viernes: 'FRIDAY',
  Sábado: 'SATURDAY',
  Domingo: 'SUNDAY',
};

export const weekdayToDay = Object.fromEntries(
  Object.entries(dayToWeekday).map(([day, weekday]) => [weekday, day]),
);
