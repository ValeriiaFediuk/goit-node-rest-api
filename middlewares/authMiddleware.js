import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js"; 
import User from "../db/models/userModel.js"; 

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers; 
  const [bearer, token] = authorization.split(" "); 
  
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id); 

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });  // Якщо виникла помилка при перевірці токена
  }
};

export { authenticate };
