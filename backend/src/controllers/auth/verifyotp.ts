import { Request, Response } from "express";
import mongoose from "mongoose";

// Define the schema for the otp data
const OtpverifySchema = new mongoose.Schema({
  AadharNumber: String,
  Epic: String,
  OtpVerify: Boolean,
});

// Check if the model has already been compiled
const OtpverifyModel = mongoose.models.Otp || mongoose.model("Otp", OtpverifySchema);

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb+srv://sauhardsingh093:sauhard123@cluster0.80i3huf.mongodb.net/label");// replace with your mongo uri string

export default async (req: Request, res: Response) => {
  try {
    const { AadharNumber, Epic } = req.query;

    // Check if an OTP document with the AadharNumber and Epic already exists
    const existingOtp = await OtpverifyModel.findOne({ AadharNumber, Epic });
    // console.log("existingOtp",existingOtp)

    if (existingOtp) {
      res.status(200).json({ OtpVerify: existingOtp.OtpVerify });
    } else {
      res.status(404).json({ message: "OTP not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
