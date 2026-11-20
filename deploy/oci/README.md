# OCI deployment

This repository is prepared to run the Vite frontend, Spring Boot API, and a
reverse proxy on an OCI Compute VM. The API connects to a separate MySQL
HeatWave database; credentials stay in `.env.oci` and are not baked into images.

## Prerequisites

- An OCI account and an Always Free eligible VM and MySQL HeatWave database.
- A DNS name pointing to the VM's public IP. Caddy obtains and renews HTTPS
  certificates automatically when ports 80 and 443 are reachable.
- The VM and database connected through a private network. Do not expose MySQL
  port 3306 to the public internet.
- A MySQL application user with only the permissions needed by the app and
  Flyway. Use a separate read-only account if the instructor needs to inspect
  rows.

## Configure and start

1. Copy `.env.oci.example` to `.env.oci`.
2. Set `DOMAIN`, `CORS_ALLOWED_ORIGINS`, and the MySQL HeatWave connection
   details. Generate a unique Base64 JWT secret from at least 32 random bytes.
3. From the repository root on the VM, run:

   ```sh
   docker compose --env-file .env.oci -f compose.oci.yaml up -d --build
   ```

4. Check startup with:

   ```sh
   docker compose --env-file .env.oci -f compose.oci.yaml logs -f api
   ```

Flyway applies the versioned schema migrations at startup, and Hibernate
validates the resulting schema. The migrations also add two synthetic doctors,
two specialties, and weekday schedules so a registered patient can create a
real appointment. Keep the OCI database credentials out of Git and do not give
the app account administrator privileges. The appointment is stored by the API
in MySQL; do not use the frontend's local demo administrator account to test
persistence.
