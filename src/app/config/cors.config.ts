export const corsConfig = {
    origin: '*', // Adjust for production
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
    credentials: true,
};