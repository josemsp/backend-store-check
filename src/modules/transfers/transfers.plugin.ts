import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetTransferController,
	ListTransfersController,
	CreateTransferController,
	UpdateTransferController,
	UpdateTransferStatusController,
	DeleteTransferController,
} from './transfers.controller';

export const transfersPlugin: WorkerModule = {
	name: 'transfers',
	basePath: '/api/v1/transfers',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListTransfersController },
		{ method: 'get', path: '/:id', handler: GetTransferController },
		{ method: 'post', path: '/', handler: CreateTransferController },
		{ method: 'put', path: '/:id', handler: UpdateTransferController },
		{ method: 'patch', path: '/:id/status', handler: UpdateTransferStatusController },
		{ method: 'delete', path: '/:id', handler: DeleteTransferController },
	],
};
