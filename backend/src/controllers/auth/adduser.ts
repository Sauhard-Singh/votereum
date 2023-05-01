import { Request, Response } from "express";
import mongoose from "mongoose";

// Define the schema for the otp data
const UsersSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    Epic: String,
    AadharNumber: String,
    admin: Boolean,
    verified: Boolean,
});

// Check if the model has already been compiled
const UsersModel = mongoose.models.UsersInfo || mongoose.model("UsersInfo", UsersSchema);

// Connect to MongoDB using Mongoose
mongoose.connect("//your mongouri");  // r  // replace with your mongo uri string

export default async (req: Request, res: Response) => {
  try {
    const { name, mobile, Epic, AadharNumber, admin,verified } = req.body;

    // Check if an OTP document with the same AadharNumber and Epic already exists
    const existing = await UsersModel.findOne({ AadharNumber, Epic });

    if (existing) {
      console.log("User already exists");
      return res.status(200).json({ message: "User already exists." });
    } else {
      // If the OTP document does not exist, create a new one with OtpVerify set to true
      const newuser = new UsersModel({
        name: name,
        mobile: mobile,
        Epic: Epic,
        AadharNumber: AadharNumber,
        admin: admin,
        verified: verified,
      });
      await newuser.save();
      console.log("User added successfully");
    }

    res.status(200).json({ message: "Users added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
