# MediTurno - Sistema Web para la Gestión de Citas Médicas

## Resumen
MediTurno es una aplicación web orientada a consultorios y centros médicos pequeños que centralizará la información de pacientes, médicos, especialidades, horarios y citas en una sola plataforma[cite: 1]. El propósito central es reducir los cruces de horarios y mejorar la organización del proceso de reserva y seguimiento de citas médicas[cite: 1].

##  Tecnologías y Herramientas
* **Frontend:** React[cite: 1]
* **Backend:** Java con Spring Boot[cite: 1]
* **Base de Datos:** MySQL[cite: 1]
* **Gestión y Control de Versiones:** Git, GitHub y Jira[cite: 1]

## Roles de Usuario
El sistema cuenta con accesos diferenciados para tres tipos de usuarios[cite: 1]:

* **Paciente:** Consulta médicos y horarios; reserva, cancela o reprograma citas; revisa su historial[cite: 1].
* **Médico:** Administra su disponibilidad, consulta su agenda y actualiza el estado de las citas[cite: 1].
* **Administrador:** Gestiona usuarios, médicos, pacientes, especialidades y citas; consulta indicadores básicos[cite: 1].
## Conexión con el backend (SistemaBackend)

1. Levanta el backend (`mvn spring-boot:run`, puerto 8080) con `DB_*` y `JWT_SECRET` definidos.
2. `npm install && npm run dev`. Vite redirige `/api` a `http://localhost:8080` (ver `vite.config.js`), así que no hay problemas de CORS en local.
3. En producción define `VITE_API_URL` (ver `.env.example`) y agrega el dominio del front a `CORS_ALLOWED_ORIGINS` del backend.

Ya conectado al backend: registro, login (JWT), perfil del paciente (`/patients/me`) y guardas de ruta por rol (`ProtectedRoute`).
Aún con datos locales/mock (el backend todavía no tiene esos endpoints): médicos, especialidades, horarios, citas y estadísticas.
