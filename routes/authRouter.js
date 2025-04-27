import express from "express";
import { register, login, logout, getCurrent, updateAvatar, verifyEmail, resendVerifyEmail } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent ); 

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

router.get('/verify/:verificationToken', verifyEmail);

router.post('/verify', resendVerifyEmail);

export default router;
