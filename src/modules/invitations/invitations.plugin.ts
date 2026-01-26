
import { authMiddleware } from "../../app/middlewares/auth.middleware";
import { WorkerModule } from "../../app/routing/worker.module.registry";
import { InviteUserOwnerController, ValidateInvitationController, AcceptInvitationController } from "./invitations.controllers";

export const invitationsPluginPrivate: WorkerModule = {
    name: 'invitations-private',
    basePath: '/api/v1/invitations',
    middleware: [authMiddleware],
    routes: [
        { method: 'post', path: '/', handler: InviteUserOwnerController },
    ]
}

export const invitationsPluginPublic: WorkerModule = {
    name: 'invitations-public',
    basePath: '/api/v1/invitations',
    routes: [
        { method: 'post', path: '/validate', handler: ValidateInvitationController },
        { method: 'post', path: '/accept', handler: AcceptInvitationController },
    ]
}