import { DomainEvent } from "../events/event.types";
import { aiRestockJob } from "../jobs/ai-restock.job";
// import { notifyJob } from "../jobs/notify.job";
// import { logisticsJob } from "../jobs/logistics.job";

export default {
    async queue(
        batch: MessageBatch<DomainEvent>,
        env: any
    ) {
        for (const message of batch.messages) {
            const event = message.body;

            try {
                switch (batch.queue) {
                    case "ai-restock":
                        await aiRestockJob(event);
                        break;

                    case "notify":
                        // await notifyJob(event);
                        break;

                    case "logistics":
                        // await logisticsJob(event);
                        break;
                }

                message.ack();
            } catch (error) {
                console.error("Queue job failed", error);
                message.retry();
            }
        }
    },
};
