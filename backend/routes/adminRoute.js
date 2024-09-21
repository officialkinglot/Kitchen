import express from "express";
import orderModel from "../models/orderModel.js"

const adminRouter = express.Router();

// API endpoint to list all orders (for admin)
adminRouter.get('/orders', async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
});

// API endpoint to update order status (for admin)
adminRouter.post('/update-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating order status" });
    }
});

// API endpoint to remove an order (for admin)
adminRouter.post('/remove', async (req, res) => {
    try {
        const { id } = req.body;
        await orderModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Order removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default adminRouter;