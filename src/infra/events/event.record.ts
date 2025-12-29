import { DomainEvent } from "./event.types";

export interface EventRecord<T = unknown> extends DomainEvent<T> {
    processed: boolean;
}
