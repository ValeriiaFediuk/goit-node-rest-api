import bcrypt from "bcryptjs";
import User from "../db/models/userModel.js"; 

const createUser = async (email, password, verificationToken) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    verificationToken,
  });
  return newUser;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const updateUserAvatar = async (userId, avatarURL) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.avatarURL = avatarURL;
  await user.save();
};

export { createUser, findUserByEmail, updateUserAvatar };
