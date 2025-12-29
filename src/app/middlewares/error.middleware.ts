import { Context } from "hono";
import { AppContext } from "../../shared/supabase";
import { HTTPException } from "hono/http-exception";

export async function errorMiddleware(err: Error, c: Context<AppContext>) {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    if (err.name === 'ZodError') {
        return c.json({
            success: false,
            message: 'Validation error',
            errors: JSON.parse(err.message)
        }, 400);
    }

    console.error(err);
    return c.json({
        success: false,
        message: err.message || 'Internal Server Error'
    }, 500);
}
