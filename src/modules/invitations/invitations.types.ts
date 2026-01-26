import z from "zod";
import {
    AcceptInvitationAPISchema,
    AcceptInvitationAPISchemaResponse,
    InvitationsAPISchema,
    InvitationsDBSchema
} from "./invitations.schemas";

export type InvitationsInput = z.input<typeof InvitationsAPISchema>;
export type InputInvitations = z.output<typeof InvitationsDBSchema>;

export type AcceptInvitationInput = z.input<typeof AcceptInvitationAPISchema>;
export type AcceptInvitationOutput = z.output<typeof AcceptInvitationAPISchemaResponse>;
