import { authMiddleware } from '../../app/middlewares/auth.middleware';
import { WorkerModule } from '../../app/routing/worker.module.registry';
import {
	GetOwnerRelationshipController,
	ListOwnerRelationshipsController,
	CreateOwnerRelationshipController,
	UpdateOwnerRelationshipController,
	ApproveOwnerRelationshipController,
	RejectOwnerRelationshipController,
	DeleteOwnerRelationshipController,
} from './owner-relationships.controller';

export const ownerRelationshipsPlugin: WorkerModule = {
	name: 'owner-relationships',
	basePath: '/api/v1/owner-relationships',
	middleware: [authMiddleware],
	routes: [
		{ method: 'get', path: '/', handler: ListOwnerRelationshipsController },
		{ method: 'get', path: '/:id', handler: GetOwnerRelationshipController },
		{ method: 'post', path: '/', handler: CreateOwnerRelationshipController },
		{ method: 'put', path: '/:id', handler: UpdateOwnerRelationshipController },
		{ method: 'patch', path: '/:id/approve', handler: ApproveOwnerRelationshipController },
		{ method: 'patch', path: '/:id/reject', handler: RejectOwnerRelationshipController },
		{ method: 'delete', path: '/:id', handler: DeleteOwnerRelationshipController },
	],
};
