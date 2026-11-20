# Railway Free deployment

This deployment uses three Railway services in one project:

1. MySQL from Railway's MySQL template.
2. The Spring Boot API from `backend/Dockerfile`.
3. The frontend from `Dockerfile.railway-frontend`.

The backend and database communicate over Railway's private network. The
frontend proxies `/api` requests privately to the backend, so the browser uses
one public origin and the database does not need public access.

## Cost limits

Railway's current Free plan is $0, requires no credit card, and includes $1 of
monthly resource usage. It allows up to three services, each with a maximum of
0.5 GB RAM and 1 vCPU, plus one volume up to 0.5 GB. Services sleep after
inactivity; when the monthly usage credit is exhausted, services stop until
the next billing cycle. Volumes are retained. The account also starts with a
one-time trial credit, after which deployments stop unless the workspace
continues on Free or is upgraded.

Do not add a payment method or upgrade to Hobby/Pro if the project must remain
at $0. Verify the current plan and usage in Railway before deployment:

- [Railway Free plan and limits](https://docs.railway.com/pricing/free-plan)
- [Railway resource pricing](https://docs.railway.com/reference/pricing/plans)
- [Railway MySQL service](https://docs.railway.com/databases/mysql)

## Create the services

1. Create a Railway project and add the **MySQL** template. Set
   `MYSQL_DATABASE` to `mediturno`. Keep the database private and ensure a
   persistent volume is mounted at `/var/lib/mysql` (the Free plan includes
   one volume up to 0.5 GB).
2. Add a backend service from this repository. Set its root directory to
   `/backend` and use the `Dockerfile` there. Set `PORT` to `8080`. Add these
   variables, replacing `MySQL` if you named the database service differently:

   ```text
   DB_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?serverTimezone=UTC
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   JWT_SECRET=<unique-secret-of-at-least-32-random-bytes>
   CORS_ALLOWED_ORIGINS=https://<frontend-domain>
   ```

3. Add a frontend service from the same repository. Set its root directory to
   `/` and Dockerfile path to `Dockerfile.railway-frontend`. Set:

   ```text
   BACKEND_URL=http://${{backend.RAILWAY_PRIVATE_DOMAIN}}:8080
   ```

   Replace `backend` if you used another service name. Expose port `80` and
   generate a Railway domain for the frontend.
4. Put the generated frontend origin in `CORS_ALLOWED_ORIGINS` on the backend
   service, then redeploy the backend.
5. On the first successful API startup, Flyway creates the schema. Run
   `backend/scripts/seed-demo-catalog.sql` against the `mediturno` database,
   register a patient through the app, and book a test appointment.

Keep the MySQL service private. To let the instructor inspect the tables,
create a separate read-only MySQL user and provide access only for the demo;
never share the application's database password.
