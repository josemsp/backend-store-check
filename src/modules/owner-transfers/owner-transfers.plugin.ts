import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetOwnerTransferController,
	ListOwnerTransfersController,
	CreateOwnerTransferController,
	UpdateOwnerTransferController,
	SendOwnerTransferController,
	ReceiveOwnerTransferController,
	CancelOwnerTransferController,
	DeleteOwnerTransferController,
} from './owner-transfers.controller';

export const ownerTransfersPlugin: WorkerModule = {
	name: 'owner-transfers',
	basePath: '/api/v1/owner-transfers',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListOwnerTransfersController },
		{ method: 'get', path: '/:id', handler: GetOwnerTransferController },
		{ method: 'post', path: '/', handler: CreateOwnerTransferController },
		{ method: 'put', path: '/:id', handler: UpdateOwnerTransferController },
		{ method: 'patch', path: '/:id/send', handler: SendOwnerTransferController },
		{ method: 'patch', path: '/:id/receive', handler: ReceiveOwnerTransferController },
		{ method: 'patch', path: '/:id/cancel', handler: CancelOwnerTransferController },
		{ method: 'delete', path: '/:id', handler: DeleteOwnerTransferController },
	],
};
