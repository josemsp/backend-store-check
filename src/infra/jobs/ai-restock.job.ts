import { DomainEvent } from "../events/event.types";
import { calculateRestock, StockBelowMinPayload } from "./calculate-restock";

export async function aiRestockJob(event: DomainEvent) {
    const result = calculateRestock(event.payload as StockBelowMinPayload);

    console.log("Restock suggestion:", result);

    // aquí luego:
    // - guardar en DB
    // - notificar
}
