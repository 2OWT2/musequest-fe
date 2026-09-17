# Railway deployment

Paste `railway.env.example` into the frontend service's Variables → RAW Editor.
The backend service must be named `musequest-be`, or replace that reference with its actual name.
Both services and Postgres must be in the same Railway project environment.
Set variables before building: data mode and the API rewrite destination are captured during `next build`.

Use this repository as the frontend service root. Build with `yarn build` and start with `yarn start --hostname 0.0.0.0`.
Assign the public domain `musequest.ai` to this service, targeting port 3000.
The canonical URL and social metadata intentionally use `https://musequest.ai` from the supplied brand reference.
The backend and database can remain private; the frontend proxies only `/api/*`.
`PGDATA` belongs to the Postgres service, not either application service.

See the backend's `deployment/README.md` for its variables and startup settings.

Reference syntax: https://docs.railway.com/variables
Private networking: https://docs.railway.com/networking/private-networking
