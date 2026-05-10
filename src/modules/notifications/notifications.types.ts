import z from "zod";
import {
    ListNotificationsSchema,
    NotificationDBSchema,
    CreateNotificationAPISchema,
    NotificationAPISchema,
    CreateNotificationDBSchema,
    UpdateNotificationDBSchema,
    MarkAsReadSchema,
} from "./notifications.schemas";

export type NotificationAPI = z.infer<typeof NotificationAPISchema>;
export type NotificationDB = z.input<typeof NotificationDBSchema>;

export type CreateNotificationInput = z.input<typeof CreateNotificationAPISchema>;
export type CreateNotificationDB = z.output<typeof CreateNotificationDBSchema>;

export type NotificationTypeZod = z.infer<typeof NotificationDBSchema>;

export type CreateNotificationFromZod = Omit<NotificationTypeZod, 'id' | 'created_at' | 'is_read'>;

export type CreateNotification = z.infer<typeof CreateNotificationAPISchema>;

export type UpdateNotificationFromZod = z.infer<typeof UpdateNotificationDBSchema>;

export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;

export type ListNotificationsParams = z.infer<typeof ListNotificationsSchema>;
