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
* **Administrador:** Gestiona especialidades y citas; consulta indicadores del sistema.

Los registros de médicos, pacientes, horarios y citas que muestra el frontend se
consultan o actualizan mediante la API del backend y se persisten en MySQL.
`localStorage` conserva únicamente la sesión autenticada; ya no se usa como
almacén de datos de negocio ni como fuente de cuentas de demostración.

## Backend

El servicio Java/Spring Boot está en [`backend/`](./backend/README.md). Allí se
documentan los requisitos locales, las variables de entorno y las rutas iniciales
de autenticación.