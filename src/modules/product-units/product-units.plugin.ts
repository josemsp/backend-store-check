import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetProductUnitController,
	ListProductUnitsController,
	CreateProductUnitController,
	UpdateProductUnitController,
	DeleteProductUnitController,
} from './product-units.controller';

export const productUnitsPlugin: WorkerModule = {
	name: 'product-units',
	basePath: '/api/v1/product-units',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListProductUnitsController },
		{ method: 'get', path: '/:id', handler: GetProductUnitController },
		{ method: 'post', path: '/', handler: CreateProductUnitController },
		{ method: 'put', path: '/:id', handler: UpdateProductUnitController },
		{ method: 'delete', path: '/:id', handler: DeleteProductUnitController },
	],
};
