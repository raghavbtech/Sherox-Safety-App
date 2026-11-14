# SheRox Architectural & Security Decisions

This document records the key architectural, technical, and security decisions made during the migration of SheRox to Node.js, Express, and MongoDB.

---

## 1. MongoDB (Mongoose) over SQLite (SQLAlchemy)

- **Decision**: Migrate the persistence layer from a local SQLite database file to MongoDB Atlas with Mongoose.
- **Why**: SQLite persists records into a single disk file on the application server. Cloud platforms like Render use ephemeral container filesystems that reset upon redeploying or sleeping, leading to total data loss. MongoDB Atlas provides managed, persistent cloud storage across deployments and native support for GeoJSON and `2dsphere` geospatial indexing for location tracking and safe routes.
- **Rejected Alternatives**: PostgreSQL (good relational choice, but MongoDB's schema flexibility and native GeoJSON indexing map directly to document-based location/sensor data).
- **One-line Interview Answer**: *"We switched from SQLite to MongoDB Atlas because ephemeral cloud hosts wipe SQLite files on redeployment, and MongoDB provides persistent cloud storage with native 2dsphere geospatial indexing."*

---

## 2. JWT in Authorization Header

- **Decision**: Transmit authentication credentials via the standard HTTP `Authorization: Bearer <token>` header on all protected endpoints.
- **Why**: Using standardized headers separates authentication metadata from application payload data, aligns with RFC 6750, prevents sensitive tokens from leaking into server access logs (which frequently log query strings), and allows clean modular middleware verification.
- **Rejected Alternatives**: Query string tokens (`?token=...`, leaked in URL history and server logs), HTTP-only cookies (adds CSRF vulnerabilities without cross-origin configuration benefit).
- **One-line Interview Answer**: *"We pass JWTs in the Authorization Bearer header following RFC standards to keep credentials out of URL query parameters and access logs."*

---

## 3. Deriving User Identity Exclusively from the JWT

- **Decision**: Eliminate all client-supplied `user_email` / `user` body and query parameters; extract the authenticated user identity strictly from the verified JWT claims (`req.user.id`).
- **Why**: Trusting client-supplied identifiers creates Broken Object-Level Authorization (BOLA / IDOR). Any user could view, modify, or delete another user's contacts simply by sending their email address in the request. Deriving the user directly from the verified signature guarantees cryptographic proof of ownership.
- **Rejected Alternatives**: Keeping `user_email` and comparing it to the token (redundant, error-prone, and leaves open attack surface if checks are forgotten).
- **One-line Interview Answer**: *"We pull user identity strictly from the verified JWT on the server so malicious users cannot tamper with email parameters to access other users' safety contacts."*

---

## 4. Password Hashing with bcryptjs

- **Decision**: Hash user passwords with `bcryptjs` using a salt work factor of 10.
- **Why**: Passwords must never be stored in plaintext. `bcrypt` incorporates an adaptive key derivation function with an automatically generated salt and adjustable cost factor that is resistant to rainbow table and GPU-accelerated brute-force attacks.
- **Rejected Alternatives**: Plain SHA-256 / MD5 (dangerously fast to crack with modern GPUs), PBKDF2 (effective, but bcrypt is the Node.js industry standard for password storage).
- **One-line Interview Answer**: *"We hash passwords with bcrypt at 10 rounds of salting to protect user credentials against rainbow table and brute-force attacks."*

---

## 5. Mocking SMS Services in Automated Tests

- **Decision**: Mock Fast2SMS calls in test mode (`process.env.NODE_ENV === 'test'`) and whenever API keys are not supplied.
- **Why**: Unit and integration tests must run quickly, deterministically, offline, and without consuming paid SMS credits or sending unwanted alerts to real phone numbers during CI runs.
- **Rejected Alternatives**: Hitting live Fast2SMS API with test numbers (flaky network dependency, incurs real SMS billing costs, requires valid provider credits in CI).
- **One-line Interview Answer**: *"We mock SMS dispatches in tests to ensure CI test runs are fast, reliable, offline-capable, and don't spend live SMS credits."*

---

## 6. Separation of `app.js` and `index.js`

- **Decision**: Build the Express application instance in `app.js` without calling `.listen()`, and start the HTTP server and database connection in `index.js`.
- **Why**: Separating app configuration from network listener allows Supertest to import `app.js` directly and test HTTP endpoints in-memory without binding to actual network ports, preventing `EADDRINUSE` port collision errors and allowing parallel test execution.
- **Rejected Alternatives**: Putting everything in a single `server.js` file (makes automated integration testing with Supertest difficult and prone to port conflicts).
- **One-line Interview Answer**: *"We separate the Express app definition from the port listener so integration tests can mount the app in-memory with Supertest without port collisions."*

---

## 7. Strict CORS & Security Headers with Helmet

- **Decision**: Configure `helmet` for secure HTTP headers (HSTS, CSP, X-Frame-Options) and configure CORS to permit only the authorized frontend origin (`CLIENT_ORIGIN`, Vercel production domain, and localhost in development).
- **Why**: Unrestricted CORS (`*`) allows any malicious origin to forge API requests using hijacked sessions. `helmet` protects against common web vulnerabilities including clickjacking, MIME-type sniffing, and cross-site scripting.
- **Rejected Alternatives**: Wildcard `cors()` (exposes authenticated endpoints to third-party web origins).
- **One-line Interview Answer**: *"We enforce restricted CORS and Helmet security headers to protect users against cross-origin attacks, clickjacking, and MIME-sniffing."*

---

## 8. OpenStreetMap and OSRM as Open Mapping Alternatives

- **Decision**: Utilize Leaflet with OpenStreetMap tiles and OSRM (Open Source Routing Machine) instead of proprietary Google Maps Directions and Geocoding APIs.
- **Why**: Google Maps APIs require billing setup, credit cards, and proprietary API keys that risk quota exhaustion or accidental billing. OpenStreetMap and OSRM are open, free, privacy-friendly, and require zero secret keys or billing accounts to provide reverse geocoding, route calculations, and interactive map displays.
- **Rejected Alternatives**: Proprietary mapping services requiring credit card registration or subscription quotas.
- **One-line Interview Answer**: *"We adopted Leaflet, OpenStreetMap, and OSRM to provide route planning and reverse geocoding without requiring paid API keys or proprietary billing."*
