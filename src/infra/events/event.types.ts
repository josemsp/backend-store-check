export type DomainEventType =
    | "stock.below_min"
    | "order.status_changed";

export interface DomainEvent<TPayload = unknown> {
    id: string;
    aggregate: string;
    type: DomainEventType;
    occurredAt: string;
    payload: TPayload;
    meta?: {
        companyId?: string;
        userId?: string;
        source?: string;
    };
}
