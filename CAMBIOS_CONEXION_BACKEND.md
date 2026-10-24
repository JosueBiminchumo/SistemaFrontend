# Cambios para conectar el frontend con el backend

## Archivos nuevos
- `src/services/statisticsService.js` — `/statistics/dashboard` y `/statistics/appointments`.
- `src/pages/doctor/doctorApi.js` — reemplaza `doctorStorage.js` (localStorage) por llamadas a la API.
- `src/pages/doctor/useAsync.js` — hook para cargar datos (loading / error).

## Archivos eliminados (datos de ejemplo / localStorage)
- `src/pages/doctor/doctorStorage.js`, `src/pages/patient/doctorsMock.js`,
  `src/services/localStorageService.js`, `src/pages/patient/PatientDashboardPage.jsx` (duplicado).

## Servicios
- `appointmentService.js`: vista en español para paneles (`toPanelView`, `getPanelAppointments`,
  `getPanelAppointmentById`, `changePanelStatus`, `cancelPanelAppointment`) y `updatedAt`.
- `specialtyService.js`: ícono para Ginecología.

## Páginas conectadas
| Página | Endpoints |
|---|---|
| Médico: dashboard, citas, detalle, pacientes | `GET /appointments`, `GET /appointments/{id}`, `PATCH /appointments/{id}/status` |
| Médico: agenda | `GET/PUT /doctors/{id}/schedule/rules` |
| Médico: perfil | `GET/PUT /doctors/me` (solo biografía) |
| Admin: dashboard y reportes | `GET /statistics/*`, `GET /appointments` |
| Admin: citas | `GET /appointments`, `PATCH /appointments/{id}/cancel` |
| Admin: especialidades | `GET/POST/PUT/DELETE /specialties` |
| Público: inicio, médicos, especialidades | `GET /doctors`, `GET /specialties` |
| Paciente: dashboard (ruta duplicada corregida) | `GET /patients/me`, `GET /appointments` |

## Limitaciones (el backend no tiene el endpoint)
- Admin > Configuración: muestra los datos reales de la sesión, pero no puede guardar nombre ni cambiar contraseña.
- Médico > Perfil: solo se edita la biografía (no hay teléfono en el modelo del médico).
- "Médicos con más citas" se calcula en el navegador con las citas del año (no hay `groupBy=doctor`).
