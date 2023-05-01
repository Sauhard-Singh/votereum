import { Router } from "express";
import loginController from "../controllers/auth/login";
import checkController from "../controllers/auth/check";
import logoutController from "../controllers/auth/logout";
import otpController from "../controllers/auth/otp";
import otpverifyController from "../controllers/auth/verifyotp";
import adduser from "../controllers/auth/adduser";

const router = Router();

router.post("/login", loginController);
router.post("/check", checkController);
router.post("/logout", logoutController);
router.post("/otp", otpController);
router.get("/verifyotp", otpverifyController);
router.post("/adduser",adduser)


export default router;
