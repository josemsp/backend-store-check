import { queue } from "../queue";
import { aiRestockJob } from "./ai-restock.job";

queue.register("ai-restock", aiRestockJob);
