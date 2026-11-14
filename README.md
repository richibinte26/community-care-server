# Community Care Server

REST API for the Community Care social development events platform.

Built with Express, MongoDB and JWT verification (jose) against Better Auth's JWKS endpoint.

## Routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | /events | Public | Upcoming events (supports limit, type, search) |
| GET | /events/:id | Public | Single event details |
| GET | /my-events | JWT | Events created by the logged-in user |
| POST | /events | JWT | Create an event (future date only) |
| PATCH | /events/:id | JWT | Update own event |
| DELETE | /events/:id | JWT | Delete own event |
| POST | /joins | JWT | Join an event |
| GET | /joins | JWT | Events joined by the logged-in user |
| GET | /joins/check/:eventId | JWT | Check whether the user already joined |

## Environment variables

PORT, MONGODB_URI, JWKS_URL, AUTH_ISSUER

## Run locally

npm install
npm run dev