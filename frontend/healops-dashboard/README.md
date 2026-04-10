# HealOps Web Dashboard UI

Modern healthcare SaaS dashboard UI built with plain HTML, Tailwind CSS, and modular JavaScript.

## Quick Run

1. Ensure backend is running on port 8000.
2. Open `frontend/healops-dashboard/index.html` in a browser.

No build step is required.

## What Is Connected

- Login and signup are connected to `/api/auth/login` and `/api/auth/register`
- Profile data is loaded from `/api/auth/me`
- Patients page reads and writes to `/api/patients/`
- Appointments page reads from `/api/appointments/` and can create via `/api/appointments/`
- Dashboard stats and activity are generated from live API responses

## Structure

- `src/layout` - Sidebar and top navbar
- `src/components` - Reusable UI blocks
- `src/pages` - Auth and dashboard pages
- `src/services` - API client and token/base URL handling

## Notes

- Uses Tailwind via CDN
- Works as a component-style architecture using JS modules
- Includes responsive sidebar, global search, auth flow, and CRUD hooks
- No hardcoded dummy datasets are used in runtime
