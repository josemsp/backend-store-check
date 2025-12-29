// type QueueName = "ai-restock" | "notify" | "logistics";

// type QueueHandler = (event: any) => Promise<void>;

// const handlers: Record<QueueName, QueueHandler> = {
//     "ai-restock": async () => { },
//     notify: async () => { },
//     logistics: async () => { },
// };

// export const queue = {
//     register(name: QueueName, handler: QueueHandler) {
//         handlers[name] = handler;
//     },

//     async send(name: QueueName, payload: any) {
//         const handler = handlers[name];

//         if (!handler) {
//             throw new Error(`Queue handler not found: ${name}`);
//         }

//         // ejecución directa por ahora
//         await handler(payload);
//     },
// };
export { localQueue as queue } from "./queue.local";
