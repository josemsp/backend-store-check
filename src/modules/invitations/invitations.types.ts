import z from "zod";
import {
    AcceptInvitationAPISchema,
    AcceptInvitationAPISchemaResponse,
    InviteUserAPISchema,
    InviteUserDBSchema
} from "./invitations.schemas";

export type InviteUserInput = z.input<typeof InviteUserAPISchema>;
export type InviteUserDB = z.output<typeof InviteUserDBSchema>;

export type AcceptInvitationInput = z.input<typeof AcceptInvitationAPISchema>;
export type AcceptInvitationOutput = z.output<typeof AcceptInvitationAPISchemaResponse>;
