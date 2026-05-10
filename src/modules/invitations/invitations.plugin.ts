
import { authMiddleware } from "../../app/middlewares/auth.middleware";
import { WorkerModule } from "../../app/routing/worker.module.registry";
import { InviteUserController, AcceptInvitationController } from "./invitations.controllers";

export const invitationsPluginPrivate: WorkerModule = {
    name: 'invitations-private',
    basePath: '/api/v1/invitations',
    middleware: [authMiddleware],
    routes: [
        { method: 'post', path: '/', handler: InviteUserController },
    ]
}

export const invitationsPluginPublic: WorkerModule = {
    name: 'invitations-public',
    basePath: '/api/v1/invitations',
    routes: [
        { method: 'post', path: '/accept', handler: AcceptInvitationController },
    ]
}
