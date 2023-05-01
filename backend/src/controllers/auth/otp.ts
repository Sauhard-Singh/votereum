import { Request, Response } from "express";
import mongoose from "mongoose";

// Define the schema for the otp data
const OtpSchema = new mongoose.Schema({
  AadharNumber: String,
  Epic: String,
  OtpVerify: Boolean,
});

// Check if the model has already been compiled
const OtpModel = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://sauhardsingh093:sauhard123@cluster0.80i3huf.mongodb.net/label"); // replace with your mongo uri string

export default async (req: Request, res: Response) => {
  try {
    const { AadharNumber, Epic,OtpVerify } = req.body;

    // Check if an OTP document with the same AadharNumber and Epic already exists
    const existingOtp = await OtpModel.findOne({ AadharNumber, Epic });

    if (existingOtp) {
      // If the OTP document already exists, update the OtpVerify value
      existingOtp.OtpVerify = OtpVerify;
      await existingOtp.save();
    } else {
      // If the OTP document does not exist, create a new one with OtpVerify set to true
      const newOtp = new OtpModel({
        AadharNumber,
        Epic,
        OtpVerify: OtpVerify,
      });
      await newOtp.save();
    }

    console.log("Api call success");

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
  
