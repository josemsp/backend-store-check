import * as service from './inventory.service';
import { moveStockSchema } from './inventory.validators';

export async function moveStock(c: any) {
    const body = moveStockSchema.parse(await c.req.json());
    const user = c.get('user');

    await service.moveStock(c.env, {
        ...body,
        userId: user.id,
    });

    return c.json({ success: true });
}
