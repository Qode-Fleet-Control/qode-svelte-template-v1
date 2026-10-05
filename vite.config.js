import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// The fleet serves this app at its own hostname and passes it in as FLEET_APP_HOST.
// Vite answers any other Host with "Blocked request. This host is not allowed", so
// trust exactly that one; with no fleet hostname (another host, a cluster ingress)
// there is no way to know it up front, so accept any.
const allowedHosts = process.env.FLEET_APP_HOST ? [process.env.FLEET_APP_HOST] : true

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: { allowedHosts },
  preview: { allowedHosts },
})
