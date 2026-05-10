import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
    ListProductsController,
    GetProductController,
    CreateProductController,
    UpdateProductController,
    DeleteProductController,
} from './products.controller';

export const productsPlugin: WorkerModule = {
    name: 'products',
    basePath: '/api/v1/products',
    middleware: [authMiddleware],
    routes: [
        { method: 'get', path: '/', handler: ListProductsController },
        { method: 'get', path: '/:id', handler: GetProductController },
        { method: 'post', path: '/', handler: CreateProductController },
        { method: 'put', path: '/:id', handler: UpdateProductController },
        { method: 'delete', path: '/:id', handler: DeleteProductController },
    ],
};
