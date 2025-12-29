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

import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { AppContext } from './shared/supabase';
import { errorMiddleware } from './app/middlewares/error.middleware';
import { PluginRegistry } from './app/routing/route-builder';
import { healthPlugin } from './modules/health/health.plugin';
import { cors } from 'hono/cors';
import { usersPlugin } from './modules/users/users.plugin';
import { companiesPlugin } from './modules/companies/companies.plugin';

import { logger } from 'hono/logger';
import { mePlugin } from './modules/me/me.plugin';

// 1. Initialize Hono
const app = new Hono<AppContext>();

// Add logger middleware
app.use('*', logger());

// 2. CORS middleware (important for Workers)
app.use('*', cors({
	origin: '*', // Adjust according to your needs
	allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Error middleware
app.onError(errorMiddleware);

// 4. Initialize OpenAPI  (wraps Hono)
const openapi = fromHono(app, {
	docs_url: '/docs', // La documentación estará en la raíz
	schema: {
		info: {
			title: 'Backend Store Check',
			version: '1.0.0',
			description: 'API for storage and management of products and users',
		},
	},
});


// 5. Register plugins
const registry = PluginRegistry.create()
	.register(healthPlugin)
	.register(mePlugin)
	.register(usersPlugin)
	.register(companiesPlugin)

// 6. Install plugins
registry.install(openapi);

// 7. Error management: 404 Not Found
app.notFound((c) => c.json({ message: 'Not Found' }, 404));

// 8. Export worker
export default app;