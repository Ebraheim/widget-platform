# FlyRank Backend Internship Capstone — Evidence

## 1. Health Check
- `GET /health`
- Expected: `200 OK`

## 2. Authenticated Widget CRUD
- Missing API key → `401`
- Invalid API key → `401`
- Valid API key → authenticated access
- Create widget → `201`
- Read widget → `200`
- Update widget → `200`
- Delete widget → `204`

## 3. PostgreSQL Persistence
- Widgets stored in PostgreSQL
- Submissions stored in PostgreSQL
- Migration creates tenants, widgets, and submissions tables

## 4. Public Widget Delivery
- `GET /widgets/:id/config`
- Public access without API key
- Config uses short-lived cache
- `widget.v1.js` uses long-lived immutable cache

## 5. Second-Origin Embed Test
- Test website served on port 5500
- API/widget server served on port 3000
- `widget.v1.js` loads from second origin
- Public config request succeeds
- Widget renders successfully

## 6. Public Submissions
- Valid submission → `201`
- Malformed submission → `400`
- Submission persisted in PostgreSQL

## 7. Abuse Protection
- Rate limit: first requests succeed, burst eventually returns `429`
- Honeypot submission returns spam rejection

## 8. Geo Enrichment
- Provider A attempted first
- Provider B used as fallback
- If both providers fail, submission still succeeds

## 9. Side-Effect Resilience
- Notification runs after storage
- Forced notification failure does not change successful submission response

## 10. Authenticated Dashboard
- `GET /api/submissions` requires API key
- `GET /api/submissions/stats` requires API key
- Stats include total submissions, last 24 hours, and spam count

## 11. Tenant Isolation
- Tenant A cannot fetch Tenant B widget
- Tenant B cannot access Tenant A submissions
- Tenant-scoped queries verified using separate API keys

Setup

Install dependencies:

npm install

Start PostgreSQL:

docker compose up -d

Run the database migration:

docker exec -i widget-platform-db psql \
  -U widget_user \
  -d widget_platform \
  < migrations/001_initial_schema.sql

Start the API:

npm run dev

The API runs on:

http://localhost:3000
Health Check
curl http://localhost:3000/health

Expected response:

{
  "status": "ok",
  "message": "Widget Platform API is running"
}
Authentication

Authenticated dashboard routes use:

x-api-key

Example:

curl http://localhost:3000/api/widgets \
  -H "x-api-key: demo-api-key-123"

Requests with missing or invalid API keys return 401.

Widget API
List Widgets
GET /api/widgets
Get One Widget
GET /api/widgets/:id
Create Widget
POST /api/widgets

Example:

curl -X POST http://localhost:3000/api/widgets \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-api-key-123" \
  -d '{
    "type": "contact",
    "title": "Contact Form",
    "description": "Send us a message",
    "button_text": "Send"
  }'
Update Widget
PUT /api/widgets/:id
Delete Widget
DELETE /api/widgets/:id
Public Widget Config

Widget configuration can be loaded without authentication:

GET /widgets/:id/config

The response contains only public rendering fields.

The config response uses short-lived caching.

Embeddable Widget Script

The versioned widget script is available at:

/widget.v1.js

Example embed:

<script
  src="https://YOUR_API_HOST/widget.v1.js?id=YOUR_WIDGET_ID">
</script>

The script:

Reads the widget ID
Fetches public widget configuration
Renders the widget on the host website

The versioned asset uses long-lived immutable caching.

Public Submissions
POST /api/submissions

Example:

curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "widget_id": "YOUR_WIDGET_ID",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "message": "Hello"
    }
  }'

A valid submission returns:

201 Created

Malformed submissions return a clean 400.

Submission Protection

The public submission route includes:

Zod validation
Rate limiting
Honeypot spam protection
IP capture
Geo enrichment
Fallback geo provider
Safe notification side effects

If both geo providers fail, the submission is still stored.

If notification delivery fails, the stored submission still returns success.

Authenticated Submission Dashboard
List Submissions
GET /api/submissions

Requires:

x-api-key
Submission Stats
GET /api/submissions/stats

Example response:

{
  "total_submissions": 9,
  "submissions_last_24h": 9,
  "spam_count": 0
}
Tenant Isolation

Each authenticated request resolves a tenant from its API key.

Database queries include the tenant ID so that:

Tenant A cannot access Tenant B widgets
Tenant B cannot access Tenant A submissions

This was manually verified using two separate tenants and API keys.

Second-Origin Test

A plain HTML test website exists in:

test-site/index.html

It can be served separately:

cd test-site
python -m http.server 5500

This verifies that the widget can load and render from a different origin.

Evidence

See:

EVIDENCE.md

for the acceptance-test checklist and verification notes.

Design Notes

See:

DESIGN.md

for architecture and implementation decisions.
