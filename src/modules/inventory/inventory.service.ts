import { emit } from "../../infra/events";
import { createAdminClient } from "../../infra/supabase/admin.client";

export async function moveStock(env: any, payload: any) {
    const supabase = createAdminClient(env);

    // await supabase
    //     .schema("inventory")
    //     .from("stock_movements")
    //     .insert({
    //         product_id: payload.productId,
    //         branch_id: payload.branchId,
    //         quantity: payload.quantity,
    //         movement_type: payload.quantity > 0 ? 'in' : 'out',
    //         created_by: payload.userId,
    //     });

    // await supabase.rpc("update_stock", {
    //     p_product_id: payload.productId,
    //     p_branch_id: payload.branchId,
    //     p_quantity: payload.quantity,
    // })
}

await emit({
    type: "stock.below_min",
    aggregate: "inventory",
    payload: {
        productId: "prod_123",
        currentStock: 8,
        minStock: 20,
    },
    meta: {
        companyId: "comp_1",
        source: "inventory.service",
    },
});