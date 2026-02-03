import express from "express";
import requestRoutes from "./routes/request.routes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Request Workflow API is running.");
});

app.use("/requests", requestRoutes)

export default app;