import { EventRecord } from "./event.record";

export interface EventRepository {
    save(event: EventRecord): Promise<void>;
    markAsProcessed(eventId: string): Promise<void>;
}
