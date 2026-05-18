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
import { ownersPlugin } from './modules/owners/owners.plugin';
import { branchesPlugin } from './modules/branches/branches.plugin';
import { productsPlugin } from './modules/products/products.plugin';
import { productCategoriesPlugin } from './modules/product-categories/product-categories.plugin';
import { productUnitsPlugin } from './modules/product-units/product-units.plugin';
import { inventoryPlugin } from './modules/inventory/inventory.plugin';
import { transfersPlugin } from './modules/transfers/transfers.plugin';
import { stockAlertsPlugin } from './modules/stock-alerts/stock-alerts.plugin';
import { notificationsPlugin } from './modules/notifications/notifications.plugin';
import { ownerRelationshipsPlugin } from './modules/owner-relationships/owner-relationships.plugin';
import { ownerTransfersPlugin } from './modules/owner-transfers/owner-transfers.plugin';
import { onboardingPlugin } from './modules/onboarding/onboarding.plugin';

const app = createWorkerApp([
	// public routes
	healthPlugin,
	invitationsPluginPublic,
	// private routes
	invitationsPluginPrivate,
	usersPlugin,
	ownersPlugin,
	onboardingPlugin,
	// branchesPlugin,
	// productsPlugin,
	// productCategoriesPlugin,
	// productUnitsPlugin,
	// inventoryPlugin,
	// transfersPlugin,
	// stockAlertsPlugin,
	// notificationsPlugin,
	// ownerRelationshipsPlugin,
	// ownerTransfersPlugin,
]);

export default app;
