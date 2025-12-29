import { DomainEvent } from "../events/event.types";

export type QueueName =
    | "ai-restock"
    | "notify"
    | "logistics";

export interface Queue {
    send(queue: QueueName, event: DomainEvent): Promise<void>;
}
