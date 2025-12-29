export interface StockBelowMinPayload {
    productId: string;
    currentStock: number;
    minStock: number;
}

export function calculateRestock(payload: StockBelowMinPayload) {
    const deficit = payload.minStock - payload.currentStock;

    return {
        productId: payload.productId,
        suggestedQty: deficit > 0 ? deficit * 2 : 0,
        reason: "Stock por debajo del mínimo configurado",
    };
}
