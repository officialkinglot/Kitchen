import { model } from "mongoose";
import userModel from "../models/userModel.js"

//Add Items to user Cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId])
        {
            cartData [req.body.itemId]= 1
        }
        else{
            cartData[req.body.itemId]+=1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true, message:"Added to Cart"});
    } 
    catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}


//Remove Items from user cart

const removeFromCart = async (req, res)=> {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1 
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true, message:"Removed from Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

//Fetch user cart Data

const getCart = async (req,res)=>{
    try {
       let userData = await userModel.findById(req.body.userId);
       let cartData = await userData.cartData;
       res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export { addToCart,removeFromCart,getCart}