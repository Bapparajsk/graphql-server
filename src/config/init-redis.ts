const connection = {
    port: Number.parseInt(process.env.REDIS_PORT || "6379"), // Redis port
    host: process.env.REDIS_HOST || "127.0.0.1", // Redis host
};

const queue_names = {
    EMAIL: process.env.SEND_EMAIL_QUEUE || "myapp:send-email-queue"
    // Add more queues here as needed
};

export {queue_names, connection};
