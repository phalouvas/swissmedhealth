# Swissmedhealth (Frappe/ERPNext v15) — Copilot Instructions

## Big picture
- This app is a Frappe app inside a bench (`/workspace/development/v15`), focused on Healthcare customizations for Lead/Customer/Patient/Therapy flows.
- Core app config is in `swissmedhealth/hooks.py`; this is the primary integration map (doctype JS injections, class overrides, doc events, fixtures, migrate hooks).
- Python code is split between:
  - `swissmedhealth/swissmedhealth/hooks/` for server hooks and whitelisted actions
  - `swissmedhealth/swissmedhealth/customization/` for doctype-specific behavior overrides
  - `swissmedhealth/public/js/` for Desk form/calendar behavior
  - `swissmedhealth/public/therapy_session.py` for Therapy Session calendar event payloads

## Key architecture and data flows
- Lead lifecycle is heavily customized (`swissmedhealth/swissmedhealth/hooks/lead.py`): on load/insert it auto-creates linked docs (Medical/Dental/Consent/Stress/Longevity), manages address sync, and maps referral codes to Sales Partner.
- Customer → Patient mapping lives in `swissmedhealth/swissmedhealth/hooks/customer.py` via whitelisted `make_patient` (Lead is source, Patient is target).
- Quotation → Therapy Plan flow is in `swissmedhealth/swissmedhealth/hooks/quotation.py` (`create_therapy_plan`), and auto-creates missing Customer/Patient first.
- Therapy Session behavior is split across:
  - class override `CTherapySession` (`swissmedhealth/swissmedhealth/hooks/CTherapySession.py`) for validation, overlap checks, nursing tasks, service request status, session counters
  - doc event helpers in `customization/therapy_session/therapy_session.py` for filters and overlap rules
  - client query wiring in `public/js/therapy_session.js`

## Conventions specific to this repo
- Prefer adding behavior through Frappe hooks first (`override_doctype_class`, `doc_events`, `doctype_js`) rather than editing core doctypes.
- Many frontend actions call whitelisted Python methods directly (e.g., quotation button, merge invoice list action, therapy query filters). Keep method paths stable when refactoring.
- Fixtures are part of source-of-truth (`swissmedhealth/fixtures/*.json`) for Client Scripts, Workflow, Workflow State, and Workspace; keep changes exportable.
- Workflow state names are business-critical and referenced in code (`Draft`, `Scheduled`, `Arrived`, `Completed`, `Cancelled`). Do not rename casually.
- App uses nested package path `swissmedhealth/swissmedhealth/...`; import paths in hooks follow `swissmedhealth.swissmedhealth...`.

## Integrations and boundaries
- Depends on Frappe + ERPNext + Healthcare app objects (`TherapySession`, `TherapyType`, `Service Request`, `NursingTask`).
- Calendar integrations:
  - Patient Appointment events: `swissmedhealth.swissmedhealth.hooks.patient_appointment.get_events`
  - Therapy Session events: `swissmedhealth.public.therapy_session.get_events`
- Post-migrate behavior sets default Lead print format (`swissmedhealth/swissmedhealth/utils/after_migrate.py`).

## Developer workflows (from bench root)
- Install app in a site: `bench --site <site> install-app swissmedhealth`
- Apply schema/hooks/fixtures changes: `bench --site <site> migrate`
- Export fixtures after changing Client Script/Workflow/Workspace: `bench --site <site> export-fixtures --app swissmedhealth`
- Run tests for this app/doctypes: `bench --site <site> run-tests --app swissmedhealth`
- Rebuild assets when editing `public/js/*`: `bench build`

## Implementation tips for agents
- Start impact analysis at `swissmedhealth/hooks.py` before changing behavior; it defines what is actually active.
- For Therapy Session scheduling changes, update server validation + client query filters together (`CTherapySession.py`, `customization/therapy_session/therapy_session.py`, `public/js/therapy_session.js`).
- Be careful with direct SQL in this codebase (common pattern): preserve existing business logic and edge-case time overlap behavior when modifying queries.
- If you add/update custom buttons or list actions, mirror existing pattern: JS trigger in `public/js` or fixture Client Script + whitelisted backend method.