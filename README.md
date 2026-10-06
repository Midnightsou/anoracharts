# Anoracharts static rebuild

Files:
- `index.html` — public website
- `style.css` — public styles
- `app.js` — public routing/data/search
- `admin.html` — admin dashboard
- `admin.css` — admin styles
- `admin.js` — admin CRUD/demo CMS

## Run locally
Do not open the HTML using `file://` if you can avoid it. Serve the folder:

```bash
python3 -m http.server 8080
```

Then open:
- Public: http://localhost:8080/index.html
- Admin: http://localhost:8080/admin.html

This demo uses browser `localStorage` as its database so the admin and public pages share data in the same browser/origin.

For production, replace localStorage with a real backend/database/storage such as Supabase, Firebase, or your own API.
