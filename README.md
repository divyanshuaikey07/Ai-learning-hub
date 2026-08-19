# StudyPilot AI

StudyPilot AI is a responsive, frontend-only directory of AI tools and practical guides for students and beginners. The main website lives in `artifacts/studypilot-ai`.

## Requirements

- Node.js 24
- pnpm

Install the locked dependency set from the repository root:

```bash
pnpm install --frozen-lockfile
```

## Run the website

The current Vite configuration expects `PORT` to be set for both development and production builds.

```bash
PORT=5173 pnpm --filter @workspace/studypilot-ai run dev
```

The website is frontend-only and does not require a database or API server to run.

## Build the website for production

```bash
PORT=5173 pnpm --filter @workspace/studypilot-ai run build
```

The generated static site is written to `artifacts/studypilot-ai/dist`.

## Verify the entire workspace

The repository is a pnpm workspace containing the website, shared libraries, an API server, and a component preview package. Run the full checks with:

```bash
PORT=5173 pnpm run build
```

The workspace build runs typechecking first and then builds all packages that provide a build script.

## Repository map

- `artifacts/studypilot-ai` — StudyPilot AI website source, pages, styles, public assets, and Vite configuration
- `artifacts/api-server` — shared Express API server package
- `artifacts/mockup-sandbox` — isolated component preview package
- `lib` — shared API, database, and generated-schema packages
- `scripts` — workspace support scripts
- `pnpm-workspace.yaml` — workspace package rules, dependency catalog, and lockfile policy
- `.replit` — Replit runtime and deployment configuration

Environment variable names and hosting notes are documented separately in `ENVIRONMENT.md`. Never commit real `.env` files or secret values.