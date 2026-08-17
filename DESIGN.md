# Embeddable Widget & Lead-Capture Platform — Design

## Problem

Customers need a way to create simple widgets such as signup forms or contact forms and embed them on external websites using one script tag.

Visitors can submit data through the widget, while the backend safely validates, protects, enriches, stores, and exposes submissions to the widget owner.

## Main Actors

1. Widget Owner
2. Customer Website
3. Website Visitor

## Core Flow

Widget Owner
→ creates widget
→ receives embed script

Customer Website
→ loads widget script
→ fetches widget configuration
→ renders widget

Website Visitor
→ submits form
→ backend validates request
→ spam/rate-limit checks
→ geo enrichment
→ stores submission
→ triggers safe side effect

## Non-Goal

We will not build a full visual drag-and-drop form builder or production CDN.

The frontend widget will remain simple because the capstone is focused on backend architecture, security, resilience, and public API behavior.

## Data Model

### Tenant

Represents a customer/account using the platform.

Fields:

- `id`
- `name`
- `api_key`
- `created_at`

### Widget

Represents an embeddable widget owned by one tenant.

Fields:

- `id`
- `tenant_id`
- `type`
- `title`
- `description`
- `button_text`
- `form_fields`
- `display_options`
- `created_at`
- `updated_at`

Each widget belongs to exactly one tenant.

### Submission

Represents data submitted by a website visitor through a widget.

Fields:

- `id`
- `widget_id`
- `tenant_id`
- `payload`
- `ip_address`
- `country`
- `city`
- `spam_detected`
- `created_at`

Each submission must be linked to both the correct widget and tenant.

## Tenant Isolation

Every authenticated query must include the tenant identity.

A tenant must never be able to read, update, or delete another tenant's widgets or submissions.

## API Contracts

### Authenticated Widget Management

#### POST /api/widgets
Create a new widget for the authenticated tenant.

Success:
- `201 Created`

Errors:
- `400 Bad Request` for invalid input
- `401 Unauthorized` for missing or invalid authentication

---

#### GET /api/widgets
Return all widgets belonging to the authenticated tenant.

Success:
- `200 OK`

---

#### GET /api/widgets/:id
Return one widget belonging to the authenticated tenant.

Success:
- `200 OK`

Errors:
- `404 Not Found` if the widget does not exist for that tenant

---

#### PUT /api/widgets/:id
Update a widget belonging to the authenticated tenant.

Success:
- `200 OK`

Errors:
- `400 Bad Request` for invalid input
- `404 Not Found` if the widget does not exist for that tenant

---

#### DELETE /api/widgets/:id
Delete a widget belonging to the authenticated tenant.

Success:
- `204 No Content`

Errors:
- `404 Not Found` if the widget does not exist for that tenant

---

### Public Widget Delivery

#### GET /widgets/:id/config
Return the public configuration required to render a widget.

Success:
- `200 OK`

The response should use short-lived cache headers.

---

#### GET /widget.v1.js
Return the versioned JavaScript bundle used to load and render widgets.

Success:
- `200 OK`

The bundle should use long-lived cache headers because its URL is versioned.

---

### Public Submission API

#### POST /api/submissions
Receive a visitor submission from an external website.

Processing order:

1. Validate request
2. Check payload size
3. Apply rate limiting
4. Check spam protection
5. Attempt geo enrichment
6. Store submission
7. Trigger safe side effect

Success:
- `201 Created`

Errors:
- `400 Bad Request` for malformed input
- `413 Payload Too Large` for oversized input
- `429 Too Many Requests` when rate limited

Geo-provider or notification failures must not cause a valid submission to fail.

---

### Authenticated Dashboard

#### GET /api/submissions
Return submissions belonging to the authenticated tenant.

Success:
- `200 OK`

---

#### GET /api/stats
Return basic analytics for the authenticated tenant.

Initial statistics:

- total submissions
- submissions per widget
- submissions over time
- country breakdown