# Environment variables

This file documents variable names only. Do not add real values, credentials, tokens, passwords, or connection strings to this repository.

## StudyPilot AI website

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes for the current Vite commands | Port used by the Vite dev server and required while loading the current Vite configuration during builds. Set it to the port supplied by the hosting provider. |
| `BASE_PATH` | Yes for the current Vite commands | Vite base path used for generated asset URLs. Use `/` at the domain root, or a slash-delimited path such as `/studypilot-ai/` when hosted below a subpath. |
| `NODE_ENV` | Optional | Runtime mode used by Vite/Replit development plugins. Use `production` for production hosting when the provider does not set it automatically. |
| `REPL_ID` | Optional | Replit-only development plugin detection. It is not needed on another hosting provider. |

The StudyPilot AI website is frontend-only and currently does not require `DATABASE_URL`, `SESSION_SECRET`, or any third-party API key.

## Other workspace packages

These variables belong to the shared workspace packages, not to the StudyPilot AI website itself:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `PORT` | API server and preview packages | Listening port supplied by the runtime. |
| `LOG_LEVEL` | API server | Optional server log level; defaults to `info`. |
| `DATABASE_URL` | `lib/db` | PostgreSQL connection string for database-enabled workspace code. It is required if that package or database-backed API functionality is used. |

## Hosting checklist

1. Use Node.js 24 and pnpm.
2. Run `pnpm install --frozen-lockfile`.
3. Set `PORT` to the provider-assigned port.
4. Set `BASE_PATH=/` for a domain-root deployment, then build with `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/studypilot-ai run build` or the equivalent provider environment configuration.
5. Serve the static output from `artifacts/studypilot-ai/dist`.
6. Configure the hosting provider to fall back to `index.html` for client-side routes such as `/tools/:slug` and `/guide/:slug`.