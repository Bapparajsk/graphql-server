import Ioredis from "ioredis";

import {connection} from "@/config/init-redis";

const client = new Ioredis({
    port: connection.port, // Redis port
    host: connection.host, // Redis host
});

client.on("error", () => {
    console.log("Redis connection failed ❌");
});

client.on("connect", () => {
    console.log("Redis Connected Successfully 🚀");
});

export default client;
