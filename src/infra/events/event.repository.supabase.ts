import { createAdminClient } from "../supabase/admin.client";
import { Bindings } from "../../shared/supabase/general";
import { EventRepository } from "./event.repository";
import { EventRecord } from "./event.record";

export const createSupabaseEventRepository = (bindings: Bindings): EventRepository => {
    const supabaseAdmin = createAdminClient(bindings);

    return {
        async save(event: EventRecord) {
            const { error } = await supabaseAdmin
                .schema("events")
                .from("events")
                .insert({
                    id: event.id,
                    type: event.type,
                    aggregate: event.aggregate,
                    payload: event.payload as any, // Cast payload as compatible type for Supabase
                    occurred_at: event.occurredAt,
                    processed: event.processed,

                });

            if (error) {
                throw new Error(`Failed to save domain event: ${error.message}`);
            }
        },

        async markAsProcessed(eventId: string) {
            const { error } = await supabaseAdmin
                .schema("events")
                .from("events")
                .update({ processed: true })
                .eq("id", eventId);

            if (error) {
                throw new Error(`Failed to mark event as processed: ${error.message}`);
            }
        },
    };
};
