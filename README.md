# Anoracharts static rebuild

This package contains the public site and a browser-based admin control room.

## Run locally

From this folder:

```bash
python3 -m http.server 8080
```

Open:

- Public site: http://localhost:8080/index.html
- Admin: http://localhost:8080/admin.html

Do not open the HTML using `file://`.

## Current functionality

- Public Hot 100 displays all 100 seeded positions.
- Admin can add/edit/delete artists.
- Admin can upload or paste artist images.
- Admin can add/edit/delete albums and covers.
- Admin can add/edit/delete songs and optional artwork.
- Songs inherit album covers when no song artwork is provided.
- Admin can create chart weeks, add songs, re-rank them, move them up/down, edit points, and publish.
- Public site updates from the same browser storage.
- Awards and homepage chart stories are editable.

## Important

This is a front-end prototype. Data is stored in browser `localStorage`, not a real online database. That means admin changes only exist in the browser where you make them. For a deployed multi-device admin system, connect the same UI to Supabase/Firebase or another backend later.
