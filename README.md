# Svelte template

Provisioned from [`Qode-Fleet-Control/fleet-template-v1`](https://github.com/Qode-Fleet-Control/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows, `compose.yaml`) with a Svelte 5 single-page app in plain JavaScript, compiled by Vite (no SvelteKit) laid on top.

Listens on `0.0.0.0:$PORT` (default `3000`) and serves at the root (`/`) of its own hostname
(`https://<hash>.<FLEET_APP_DOMAIN>/`); the health check hits `/`. In the container: the static build (`dist/`) behind nginx.

## Origin

    npm create vite@latest qode-svelte-template-v1 -- --template svelte --no-interactive

Generated 2026-10-05 with create-vite 9.2.1 (host Node v22.12.0 / npm 10.9.0).

## Run it

### On the fleet

The fleet clones the repo, injects `PORT` (and the workspace's `DATABASE_URL`, `REDIS_URL`, ...) and runs
`bin/run`, which uses the docker runtime from `fleet.conf`: `docker compose build`, then `docker compose up --remove-orphans` in the foreground.

### With docker

    PORT=3000 bin/run                  # what the fleet does
    docker compose up --build        # or plain compose

### Without docker

`FLEET_RUNTIME=process bin/run` runs the plain commands from `fleet.conf`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `npx vite preview --host 0.0.0.0 --port $PORT` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

See `docs/fleet-lifecycle.md` for the full contract.

## Deviations from the generator output

- Generator choice: Svelte's own `npx sv create` always produces a SvelteKit app (the fleet already has a SvelteKit template); for plain Svelte the Svelte docs point to Vite's `svelte` template, used here.
- `vite.config.js` sets `server.allowedHosts` / `preview.allowedHosts` from `FLEET_APP_HOST` (any host when unset): Vite otherwise answers the fleet hostname with "Blocked request" in `vite dev` / `vite preview`.
- `package-lock.json` added (`npm install --package-lock-only`) so the image build can use `npm ci`.
- Added the fleet files: `bin/` (lifecycle scripts), `fleet.conf`, `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.example`, `.github/workflows/`, `docs/fleet-lifecycle.md`; fleet entries (`.fleet/`, `*.log`, ...) prepended to `.gitignore`.

## Verified

**Not yet verified in docker.** On 2026-10-05 the shared docker host's disk stayed at 0-2 GB free for over 3 hours (held by other workloads), so the image was never built; `verify.sh` / `docker compose run` must still be run before this is trusted. `migrate.py audit`: READY.

---

# Svelte + Vite

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
