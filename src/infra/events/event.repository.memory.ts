import { EventRepository } from "./event.repository";
import { EventRecord } from "./event.record";

const store: EventRecord[] = [];

export const memoryEventRepository: EventRepository = {
    async save(event) {
        store.push(event);
    },

    async markAsProcessed(eventId) {
        const evt = store.find(e => e.id === eventId);
        if (evt) evt.processed = true;
    },
};
