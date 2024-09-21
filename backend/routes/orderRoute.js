import express from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder ,removeOrder } from "../controllers/orderController.js";
 
 



const orderRouter = express.Router();


//Enpoints

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",listOrders)
orderRouter.post("/status", updateStatus)
orderRouter.post("/remove", removeOrder); 
 


export default orderRouter;