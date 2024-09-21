import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const placeOrder = async (req, res) => {
    const frontend_url = "https://naijakitchenfront.onrender.com"; // Ensure this is correct

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();

        await userModel.findOneAndUpdate({ _id: req.body.userId }, { cartData: {} });

        const line_items = req.body.items.map(item => ({
            name: item.name,
            price: item.price * 100,  // Convert to kobo
            quantity: item.quantity
        }));

        const data = {
            email: req.body.email,
            amount: req.body.amount * 100, // Convert to kobo
            metadata: {
                cart_items: line_items,
                order_id: newOrder._id,
                user_id: req.body.userId
            },
            callback_url: `${frontend_url}/verify?orderId=${newOrder._id}&success=true`,
            success_url: `${frontend_url}/myorders`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        res.json({ success: true, session_url: response.data.data.authorization_url });
    } catch (error) {
        console.log({ success: false, message: "Server Error", error: error.message });
        res.json({ success: false, message: "Server Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid Successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// User orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Errors" });
    }
}

// Listing Orders for admin panel/customer's orders
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// API for updating order status.
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// API for removing an order
const removeOrder = async (req, res) => {
    try {
        const { id } = req.body;
        await orderModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Order removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder };
