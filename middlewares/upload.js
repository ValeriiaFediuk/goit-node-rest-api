import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "../public/avatars");

await fs.mkdir(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: avatarsDir,
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${req.user.id}_${Date.now()}${extname}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Only image files are allowed (jpg, jpeg, png, gif)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});

export default upload;
