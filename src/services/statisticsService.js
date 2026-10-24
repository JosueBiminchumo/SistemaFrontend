import api from './api';

// Todas las rutas son solo ADMIN. El backend limita el rango a 366 días.
const pad = (n) => String(n).padStart(2, '0');
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISODate(new Date());

export function yearRange(year = new Date().getFullYear()) {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// GET /statistics/dashboard?from=&to=
export async function getDashboardStats({ from, to } = {}) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get('/statistics/dashboard', { params });
  return data;
}

// GET /statistics/appointments?groupBy=day|status|specialty&from=&to=
export async function getAppointmentSeries(groupBy, { from, to } = {}) {
  const params = { groupBy };
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get('/statistics/appointments', { params });
  return data;
}

// La API entrega un punto por día; aquí se agrupa por mes para los gráficos.
// Devuelve [{ month: 'Ene', appointments: n }, ...] con los 12 meses del año.
export function groupDaysByMonth(points) {
  const totals = Array(12).fill(0);
  points.forEach(({ label, value }) => {
    const month = Number(label.slice(5, 7)) - 1; // label = 'YYYY-MM-DD'
    if (month >= 0 && month < 12) totals[month] += value;
  });
  return MONTHS.map((month, i) => ({ month, appointments: totals[i] }));
}

export const STATUS_META = {
  COMPLETED: { name: 'Completadas', color: '#10b981' },
  CONFIRMED: { name: 'Confirmadas', color: '#2563eb' },
  PENDING: { name: 'Pendientes', color: '#f59e0b' },
  CANCELLED: { name: 'Canceladas', color: '#ef4444' },
};

// appointmentsByStatus ([{label:'PENDING', value}]) -> datos para torta/barras con color y porcentaje
export function toStatusChart(points = []) {
  const total = points.reduce((sum, p) => sum + p.value, 0);
  return ['COMPLETED', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((key) => {
    const value = points.find((p) => p.label === key)?.value ?? 0;
    return {
      name: STATUS_META[key].name,
      value,
      color: STATUS_META[key].color,
      percentage: total ? Math.round((value / total) * 100) : 0,
    };
  });
}

export const SPECIALTY_COLORS = ['#2563eb', '#0891b2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];
