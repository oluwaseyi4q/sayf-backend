# Sayf Technology V2 — Backend API

Node.js/Express REST API implementing the Sayf Technology V2 Backend API PRD, using MongoDB + Mongoose.

## Stack

- Node.js + Express
- MongoDB + Mongoose ODM
- JWT auth (access + refresh tokens, refresh tokens hashed & revocable)
- Cloudinary for media uploads
- Nodemailer for transactional email (contact auto-reply/notification, newsletter welcome)
- zod for request validation
- helmet, cors, express-rate-limit for security

## Quick start

You need a MongoDB instance — either local or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works fine).

```bash
npm install
cp .env.example .env        # then fill in real secrets, especially MONGODB_URI
npm run seed                 # creates the admin user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                  # starts on http://localhost:4000 (v1 base: /v1)
```

Login with the seeded admin credentials at `POST /v1/auth/login` to get an access token.

### Running MongoDB locally (optional)

If you don't want to use Atlas, install MongoDB Community Server and run:

```bash
mongod --dbpath ./data
```

Then keep `MONGODB_URI="mongodb://localhost:27017/sayf_technology"` in your `.env`.

## Project structure

```
src/
  app.js               Express app, middleware, route mounting
  server.js            Entry point — connects to MongoDB, then starts the server
  seed.js               Admin user seed script
  config/               MongoDB connection, Cloudinary config
  models/               Mongoose schemas/models (one per PRD data model)
  controllers/           Business logic per module
  routes/                 Route definitions per module
  schemas/                zod validation schemas
  middleware/            auth, error handling, rate limiting, sanitization, validation
  utils/                  JWT helpers, slugs, email, ObjectId validation
```

## Data models

Each Mongoose model in `src/models/` maps directly to a data model in the PRD:
`Admin`, `Project`, `Article`, `Testimonial`, `TeamMember`, `ContactSubmission`, `Subscriber`, `Settings`.

MongoDB's `_id` (ObjectId) is used as the primary key everywhere and is returned as `id` in API responses (as a string). Arrays (gallery, technologies, tags) are native Mongo arrays — no special handling needed.

## API overview

Base URL: `http://localhost:4000/v1` (prod: `https://api.sayftechnology.com/v1`)

All protected routes require `Authorization: Bearer <access_token>`.

| Module | Public | Protected |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/refresh` | `POST /auth/logout` |
| Projects | `GET /projects`, `GET /projects/featured`, `GET /projects/:slug` | `POST`, `PUT /:id`, `DELETE /:id` |
| Articles | `GET /articles`, `GET /articles/:slug` | `POST`, `PUT /:id`, `DELETE /:id` |
| Testimonials | `GET /testimonials` | `POST`, `PUT /:id`, `DELETE /:id` |
| Team | `GET /team` | `POST`, `PUT /:id`, `DELETE /:id` |
| Contact | `POST /contact` | `GET`, `PUT /:id`, `DELETE /:id` (archives) |
| Newsletter | `POST /newsletter/subscribe`, `POST /newsletter/unsubscribe` | `GET /subscribers`, `GET /subscribers/export` |
| Media | — | `POST /media/upload` (multipart, field `image`) |
| Settings | `GET /settings` | `PUT /settings` |
| Admin Stats | — | `GET /admin/stats` |

Where `:id` appears above, it's a MongoDB ObjectId string (e.g. `65f1a2b3c4d5e6f7a8b9c0d1`), not a numeric id.

All request/response bodies use snake_case field names exactly as specified in the PRD (e.g. `is_published`, `cover_image`), even though the database/Mongoose models use camelCase internally. The controllers handle this translation.

### Errors

All errors return:

```json
{ "error": true, "message": "Descriptive error message", "code": "ERROR_CODE" }
```

Mongo-specific error cases are mapped automatically: duplicate key (e.g. duplicate slug/email) → `409 CONFLICT`, invalid ObjectId or failed schema validation → `400 VALIDATION_ERROR`.

### Notes on a few implementation choices

- **DELETE /contact/:id** archives the submission (sets `status: "archived"`) rather than hard-deleting, per the PRD's "Archive submission" description. Swap to `ContactSubmission.findByIdAndDelete()` in `contactController.js` if you want a hard delete instead.
- **Refresh tokens** are JWTs whose hash is stored on the `Admin` document, so `POST /auth/logout` can revoke them immediately (a bare JWT can't be invalidated before expiry otherwise).
- **Slugs** auto-generate from `title` on create, and regenerate (uniquely) if `title` changes on update.
- If `CLOUDINARY_CLOUD_NAME` isn't set, `/media/upload` returns a clear 500 rather than failing silently. If `SMTP_HOST` isn't set, emails are logged to the console instead of sent, so the app still runs without email configured.

## Postman / OpenAPI

Not included in this scaffold — the endpoint table above plus the zod schemas in `src/schemas/` fully describe the contract; generating a Postman collection or OpenAPI spec from them is a good next step if needed.
