import express from "express";
import requestRoutes from "./routes/request.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3001", // Frontend URL
  credentials: true, // Allow cookies
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Request Workflow API is running.");
});

app.use("/auth", authRoutes)
app.use("/requests", requestRoutes)

export default app;