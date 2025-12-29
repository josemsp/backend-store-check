// import { Hono } from "hono";
// import { AppContext } from "../../shared/supabase";
// import { authMiddleware } from "../../app/middlewares/auth.middleware";
// import { CreateProductController, ListProductsController } from "./products.controller";

// export function registerProductsRoutes(app: Hono<AppContext>, openapi: any) {
//     // Auth middleware for /products/*
//     app.use('/products/*', authMiddleware);

//     // OpenAPI routes
//     openapi.get('/products', ListProductsController);
//     openapi.post('/products', CreateProductController);
// }
import { Hono } from 'hono';
import { fromHono } from 'chanfana';
import { AppContext } from '../../shared/supabase';
import { ListProductsController, CreateProductController } from './products.controller';
import { authMiddleware } from '../../app/middlewares/auth.middleware';

const productRoutes = new Hono<AppContext>();

productRoutes.use('*', authMiddleware);

const openapi = fromHono(productRoutes);

openapi.get('/', ListProductsController);
openapi.post('/', CreateProductController);

export { productRoutes };
