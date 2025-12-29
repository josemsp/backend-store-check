import { Queue, QueueName } from "./queue.types";
import { DomainEvent } from "../events/event.types";

type Handler = (event: DomainEvent) => Promise<void>;

const handlers: Partial<Record<QueueName, Handler>> = {};

export const localQueue: Queue & {
  register: (name: QueueName, handler: Handler) => void;
} = {
  register(name, handler) {
    handlers[name] = handler;
  },

  async send(name, event) {
    const handler = handlers[name];
    if (!handler) {
      throw new Error(`No handler registered for queue ${name}`);
    }

    await handler(event);
  },
};
