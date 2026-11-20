# MediTurno Backend

API independiente de Spring Boot para MediTurno. El primer módulo implementa
identidad, autenticación y autorización para los roles `ADMIN`, `DOCTOR` y
`PATIENT`.

## Requisitos

- Java 25 (LTS)
- Maven 3.9+
- MySQL 8+

## Configuración local

Defina `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` y `JWT_SECRET` en el entorno antes
de iniciar la API. `JWT_SECRET` debe ser una clave Base64 que represente al
menos 256 bits. Los secretos y contraseñas reales no deben guardarse en Git.

La aplicación ejecuta migraciones Flyway y valida el esquema con Hibernate;
no crea ni modifica tablas automáticamente. Para desarrollo, cree la base
`mediturno` en MySQL y use un usuario con permisos limitados a esa base.

Desde esta carpeta:

```powershell
$env:JWT_SECRET = "<clave-base64-de-al-menos-32-bytes>"
$env:DB_PASSWORD = "<contraseña-local>"
mvn spring-boot:run
```

Para ejecutar las pruebas, que usan H2 en memoria:

```powershell
mvn test
```

## Autenticación

- `POST /api/v1/auth/register`: crea una cuenta `PATIENT` si el registro está habilitado.
- `POST /api/v1/auth/login`: valida credenciales y devuelve un JWT.
- `GET /api/v1/auth/me`: devuelve los datos de la cuenta autenticada.
- `GET /api/v1/patients/me`: devuelve el perfil del paciente autenticado.
- `PUT /api/v1/patients/me`: actualiza DNI, fecha de nacimiento y teléfono.
- `GET /api/v1/specialties`: devuelve el catálogo activo; `POST`, `PUT /{id}` y `DELETE /{id}` son exclusivos de ADMIN. El borrado es lógico.
- `GET /api/v1/doctors`, `GET /api/v1/doctors/{id}` y `GET /api/v1/doctors/{id}/schedule?date=YYYY-MM-DD`: catálogo, detalle y horarios disponibles.
- `GET /api/v1/doctors/me/schedule` y `PUT /api/v1/doctors/me/schedule`: consulta y reemplaza los horarios recurrentes del médico autenticado.
- `POST /api/v1/appointments`, `GET /api/v1/appointments`, `GET /{id}`, `PUT /{id}` y `PATCH /{id}/cancel`: reserva y gestión de citas con alcance según rol.
- `PATCH /api/v1/appointments/{id}/status`: transición de estado exclusiva del médico asignado o ADMIN (`PENDING` → `CONFIRMED` → `COMPLETED`, o cancelación).
- `GET /api/v1/statistics/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD` y `GET /api/v1/statistics/appointments?groupBy=day|status|specialty&from=...&to=...`: indicadores exclusivos de ADMIN.
- El catálogo de médicos y especialidades es público. Los endpoints de gestión
  de agenda requieren `DOCTOR` (o `ADMIN`); el perfil de paciente requiere
  `PATIENT` (o `ADMIN`), y las estadísticas requieren `ADMIN`.
- Las contraseñas se almacenan con BCrypt. El hash nunca forma parte de las respuestas.

El registro se puede deshabilitar en despliegues existentes con
`AUTH_REGISTRATION_ENABLED=false`. La duración del token se configura con
`JWT_EXPIRATION_MS` (por defecto, una hora).

Ejemplo de registro:

```json
{
  "firstName": "Ana",
  "lastName": "Pérez",
  "documentNumber": "12345678",
  "birthDate": "1998-05-20",
  "phone": "987654321",
  "email": "ana@example.com",
  "password": "una-clave-segura"
}
```

El registro responde `201 Created` y crea siempre el rol `PATIENT`; un campo
`role` enviado por el cliente no se utiliza. El login responde `200 OK`,
`401 Unauthorized` corresponde a credenciales inválidas y `409 Conflict` a un
correo ya registrado.

Las fechas de cita se envían como fecha/hora ISO local (`YYYY-MM-DDTHH:mm:ss`) en la zona `America/Lima`; la tabla MySQL usa `DATETIME` y no guarda desplazamiento horario. Los horarios ocupados se rechazan con `409 Conflict`; el paciente asociado se obtiene del JWT, nunca del cuerpo de la solicitud.

La documentación OpenAPI está disponible en `/swagger-ui/index.html`. CORS se configura mediante `CORS_ALLOWED_ORIGINS`, separado por comas; el valor local predeterminado permite `http://localhost:*`.

## Esquema MySQL

Flyway crea el esquema al iniciar una base nueva: V1 crea `users`, V2 crea
`patients`, V3 crea `specialties`, `doctors`, `doctor_schedules` y `citas`, y V4
agrega un catálogo sintético para demostración. Hibernate conserva
`ddl-auto: validate`, por lo que comprueba que las migraciones coincidan con las
entidades sin alterar el esquema. Las pruebas usan un esquema temporal H2 y no
escriben en MySQL.

El catálogo de demostración contiene dos médicos y sus horarios entre semana.
Sus cuentas usan contraseñas aleatorias desconocidas y no son cuentas de acceso;
registra un paciente real en la aplicación para probar una reserva.

## Crear una base local nueva

Solo para desarrollo local y una base vacía, ejecuta
[`scripts/setup-local-mysql.sql`](./scripts/setup-local-mysql.sql) en MySQL Workbench
con una cuenta administradora. Reemplaza el marcador de contraseña antes de
ejecutarlo. El script no elimina ni modifica tablas existentes; usa
`CREATE TABLE IF NOT EXISTS`.

Como el script crea todas las tablas hasta V3, configura Flyway para tomar la
versión 3 como línea base. Así se omiten las migraciones de esquema ya creadas
manualmente y se aplica V4 para sembrar el catálogo:

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/mediturno?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "mediturno_app"
$securePassword = Read-Host "Contraseña de MySQL" -AsSecureString
$passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
}
$env:SPRING_FLYWAY_BASELINE_ON_MIGRATE = "true"
$env:SPRING_FLYWAY_BASELINE_VERSION = "3"
$random = [Security.Cryptography.RandomNumberGenerator]::Create()
$jwtBytes = New-Object byte[] 32
$random.GetBytes($jwtBytes)
$random.Dispose()
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
mvn spring-boot:run
```

Ejecuta estos comandos desde `backend/`. No uses esta línea base en una base
compartida o existente; conserva para ella la configuración y las migraciones
que ya tenga.
