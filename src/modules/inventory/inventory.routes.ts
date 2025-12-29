import { Hono } from 'hono';
import { authMiddleware } from '../../app/middlewares/auth.middleware';
import * as controller from './inventory.controller';

export const inventoryRoutes = new Hono();

inventoryRoutes.post('/move', authMiddleware, controller.moveStock);
