import {Queue, QueueOptions, WorkerOptions, Worker, Job} from "bullmq";

import {connection, queue_names} from "@/config/init-redis";

const QueueConfig: QueueOptions = { connection };

const WorkerConfig: WorkerOptions = {
    connection,
    removeOnComplete: { count: 1 }, // Remove completed jobs after 1 completion
};

export const createWorker = (name: string, processFunction: (job: Job) => Promise<void>) => {
    const worker = new Worker(name, processFunction, WorkerConfig);

    worker.on("completed", (job) => {
        console.log(`[✓]:Job ${job.id} completed successfully.`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[!]:Job ${job.id} failed with error: ${err.message}`);
    });

    worker.on("error", (err) => {
        console.error(`[!]:Worker encountered an error: ${err.message}`);
    });
    return worker;
};

export { queue_names };

export const EmailQueue = new Queue(queue_names.EMAIL, QueueConfig);
