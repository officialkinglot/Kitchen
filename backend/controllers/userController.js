import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import nodemailer from "nodemailer";

// Create Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
 

// Send Reset Password Email
const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    text: `You requested a password reset. Click the link to reset your password:${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

// Request Password Reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const token = createToken(user._id);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetPasswordEmail(email, token);
    res.json({ success: true, message: "A Reset password link has been sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

 // Reset Password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the matching token and ensure it hasn't expired
    const user = await userModel.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success:true,message:"Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ success: false, message: "Invalid token" });
    } else {
      return res.status(500).json({ success: false, message: "An error occurred while processing your request. Please try again later." });
    }
  }
};

// Login User routes
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid Credentials"});

    const token = createToken(user._id);
    res.json({ success: true, message: "Logged in successfully", token});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({email});
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Please enter a valid email" });

    if (password.length < 5)
      return res.json({ success: false, message: "Please enter at least 5 characters long" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser, forgotPassword, resetPassword };
