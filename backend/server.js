import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import eventRouter from "./routes/eventRoute.js"; // Import the event router
import adminRouter from "./routes/adminRoute.js"; // Import the admin router
import "dotenv/config";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/events", eventRouter);  
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("The API is Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
