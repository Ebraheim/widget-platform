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