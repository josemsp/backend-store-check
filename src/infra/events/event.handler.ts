import { DomainEvent } from "./event.types";
import { queue } from "../queue";

export async function handleEvent(event: DomainEvent) {
    switch (event.type) {
        case "stock.below_min":
            await queue.send("ai-restock", event);
            await queue.send("notify", event);
            break;

        case "order.status_changed":
            await queue.send("logistics", event);
            break;
    }
}
