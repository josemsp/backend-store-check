import { DomainEvent } from "./event.types";
import { handleEvent } from "./event.handler";
import { memoryEventRepository } from "./event.repository.memory";

export async function emit<TPayload>(
    event: Omit<DomainEvent<TPayload>, "id" | "occurredAt">
) {
    const fullEvent = {
        ...event,
        id: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
        processed: false,
    };

    await memoryEventRepository.save(fullEvent);
    await handleEvent(fullEvent);
    await memoryEventRepository.markAsProcessed(fullEvent.id);
}
