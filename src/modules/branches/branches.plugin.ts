import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetBranchController,
	ListBranchesController,
	CreateBranchController,
	UpdateBranchController,
	DeleteBranchController,
} from './branches.controller';

export const branchesPlugin: WorkerModule = {
	name: 'branches',
	basePath: '/api/v1/branches',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListBranchesController },
		{ method: 'get', path: '/:id', handler: GetBranchController },
		{ method: 'post', path: '/', handler: CreateBranchController },
		{ method: 'put', path: '/:id', handler: UpdateBranchController },
		{ method: 'delete', path: '/:id', handler: DeleteBranchController },
	],
};
