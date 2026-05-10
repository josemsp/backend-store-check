import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetProductCategoryController,
	ListProductCategoriesController,
	CreateProductCategoryController,
	UpdateProductCategoryController,
	DeleteProductCategoryController,
} from './product-categories.controller';

export const productCategoriesPlugin: WorkerModule = {
	name: 'product-categories',
	basePath: '/api/v1/product-categories',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListProductCategoriesController },
		{ method: 'get', path: '/:id', handler: GetProductCategoryController },
		{ method: 'post', path: '/', handler: CreateProductCategoryController },
		{ method: 'put', path: '/:id', handler: UpdateProductCategoryController },
		{ method: 'delete', path: '/:id', handler: DeleteProductCategoryController },
	],
};
