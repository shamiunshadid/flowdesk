import express from "express";
import env from "dotenv"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import workspaceRoutes from "./src/routes/v1/workspace.routes";
import boardRoutes from "./src/routes/v1/boards.routes";

const app = express();
env.config()
const port = 8000;

app.use(express.json());

// auth routes
app.all("/api/auth/{*path}", toNodeHandler(auth));


// workspace routes
app.use("/api/workspace", workspaceRoutes);

// board routes
app.use("/api/boards", boardRoutes);



app.get("/", (req, res) => {
  res.send("Hello from bunnn");
});

app.listen(port, () => {
  console.log("server is running on port:", port);
});