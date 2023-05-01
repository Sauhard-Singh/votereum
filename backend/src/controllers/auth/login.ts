import { Request, Response } from "express";
import * as yup from "yup";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import mongoose from "mongoose";

interface User {
  id: string;
  name: string;
  mobile: string;
  Epic: string;
  AadharNumber: string;
  admin: boolean;
  verified: boolean;
}

const userSchema = new mongoose.Schema<User>({
  name: String,
  mobile: String,
  Epic: String,
  AadharNumber: String,
  admin: Boolean,
  verified: Boolean,
});

const userLoginModel = mongoose.models.User || mongoose.model<User>("User", userSchema);

mongoose.connect("mongodb+srv://sauhardsingh093:sauhard123@cluster0.80i3huf.mongodb.net/label");  // replace with your mongouri

const schema = yup.object().shape({
  body: yup.object().shape({
    AadharNumber: yup.string().min(12).required(),
    Epic: yup.string().min(10).required(),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  try {
    const { AadharNumber, Epic } = req.body;
    const user = await userLoginModel.findOne({ AadharNumber, Epic });
    if (!user) {
      return res.status(404).send("Invalid Login");
    }
    if (user.verified === false) {
      return res.status(401).send("User not verified");
    }

    const plainUserObject = {
      id: user.id,
      name: user.name,
      AadharNumber: user.AadharNumber,
      Epic: user.Epic,
      mobile: user.mobile,
      admin: user.admin,
    };

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      console.log("you forgot to add .env file to the project?");
      console.log(`
                  add the following:

                  ACCESS_TOKEN_SECRET=976a66a5bd23b2050019f380c4decbbefdf8ff91cf502c68a3fe1ced91d7448cc54ce6c847657d53294e40889cef5bd996ec5b0fefc1f56270e06990657eeb6e

                  REFRESH_TOKEN_SECRET=5f567afa6406225c4a759daae77e07146eca5df8149353a844fa9ab67fba22780cb4baa5ea508214934531a6f35e67e96f16a0328559111c597856c660f177c2
      `);
      return res.status(500).send("Server error");
    }

    const accessToken = jwt.sign(plainUserObject, accessTokenSecret, { expiresIn: 60 });
    const refreshToken = jwt.sign(plainUserObject, refreshTokenSecret, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, { expires: dayjs().add(7, "days").toDate() });

    return res.send({ user: plainUserObject, accessToken });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send("Server error");
  }
};
