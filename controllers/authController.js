import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"; 
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { createUser, findUserByEmail, updateUserAvatar } from "../services/authServices.js";
import dotenv from "dotenv";
import { nanoid } from "nanoid";  
import sendEmail from "../helpers/sendEmail.js"; 

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("Email in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

    const user = await createUser(email, hashedPassword, verificationToken);

    const verificationLink = `${BASE_URL}/auth/verify/${verificationToken}`;
    const emailContent = {
      to: email,
      subject: "Verify your email",
      html: `<a href="${verificationLink}">Click here to verify your email</a>`,
    };

    await sendEmail(emailContent);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user || !user.verify) {
      throw HttpError(401, "Email not verified or password incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw HttpError(401, "Email or password is wrong");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    user.token = null;
    await user.save();

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const avatarURL = `/avatars/${req.file.filename}`;
    await updateUserAvatar(req.user.id, avatarURL);

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) throw HttpError(404, "User not found");

    await user.update({ verify: true, verificationToken: null });

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw HttpError(400, "missing required field email");

    const user = await findUserByEmail(email);
    if (!user) throw HttpError(404, "User not found");

    if (user.verify) throw HttpError(400, "Verification has already been passed");

    const verificationLink = `${BASE_URL}/auth/verify/${user.verificationToken}`;
    const emailContent = {
      to: email,
      subject: "Verify your email",
      html: `<a href="${verificationLink}">Click here to verify your email</a>`,
    };

    await sendEmail(emailContent);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout, getCurrent, updateAvatar, verifyEmail, resendVerifyEmail };
