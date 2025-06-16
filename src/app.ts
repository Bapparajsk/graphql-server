import cors from "cors";
import express from "express";

import ql_router from "./graphql/index";

import("./lib/bullmq/workers");

const app = express();
const PORT = process.env.POST || 4000;

app.use(cors());
app.use(express.json());

app.use("/graphql", ql_router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint is available at http://localhost:${PORT}/graphql`);
});




