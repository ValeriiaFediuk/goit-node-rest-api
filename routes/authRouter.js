import express from "express";
import { register, login, logout, getCurrent, updateAvatar } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent ); 

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default router;
