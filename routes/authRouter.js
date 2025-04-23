import express from "express";
import { register, login, logout, getCurrent } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
}); 

export default router;
