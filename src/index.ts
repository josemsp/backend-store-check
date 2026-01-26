/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createWorkerApp } from './app/routing/worker.app.registry';
import { healthPlugin } from './modules/health/health.plugin';
import { invitationsPluginPrivate, invitationsPluginPublic } from './modules/invitations/invitations.plugin';
import { usersPlugin } from './modules/users/users.plugin';

const app = createWorkerApp([
	// public routes
	healthPlugin,
	invitationsPluginPublic,
	// private routes
	invitationsPluginPrivate,
	// usersPlugin
]);

export default app;