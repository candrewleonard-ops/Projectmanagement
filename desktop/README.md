# FlipCRM Desktop

Electron wrapper that packages the FlipCRM web app into a standalone Windows `.exe`.
The desktop app is 100% separate from the website — both read the same source
code but build independently, so changes here never affect the Vercel deploy.

## How it works

1. `next build` with `DESKTOP_BUILD=true` produces a Next.js **standalone** server bundle in `.next/standalone/`.
2. `copy-standalone.js` copies that bundle into `desktop/next-app/`.
3. When you launch the `.exe`, Electron spawns the standalone Next.js server on `127.0.0.1:41732` and loads it in a native window.
4. All data is saved to the user's local browser-style storage on their machine.

## Build the installer (Windows)

From the `desktop/` folder:

```
npm install
npm run build:exe
```

Output: `desktop/dist/FlipCRM-Setup-0.1.0.exe` — hand this file to Marco, he double-clicks, and he has the app.

### Portable (no-install) build

```
npm run build:portable
```

## Development

Run Next.js in one terminal:

```
cd ..
npm run dev
```

Then in another terminal:

```
cd desktop
npm install
npm run dev
```

Electron will open pointing to `http://localhost:3000` with DevTools.

## Hooking up to a live server (future)

Today each install uses its own local storage. To make desktop + website share
data through a real backend:

1. Stand up an API server (Express / Fastify / Next.js API routes / Supabase).
2. Set these environment variables **before building**:
   ```
   NEXT_PUBLIC_BACKEND_MODE=remote
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
3. Rebuild the web app *and* the desktop `.exe` with the same env vars.
4. Both clients will then call the REST endpoints defined in `src/lib/backend.ts`.

The scaffolding for this switch is already in `src/lib/backend.ts` —
`BACKEND_CONFIG`, `isRemoteMode()`, and `apiFetch()`.
