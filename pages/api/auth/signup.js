// pages/api/auth/signup.js
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";
import cloudinary from "@/lib/cloudinary";

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer config
const tempDir = path.join(process.cwd(), "public", "temp");
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  await runMiddleware(req, res, upload.single("avatar"));
  await dbConnect();

  const { username, email, password } = req.body;
  const file = req.file;

  if (!username || !email || !password || !file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    await unlink(file.path);
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "chatapp/avatars",
      width: 200,
      crop: "thumb",
    });

    await unlink(file.path);

    const user = await User.create({
      username,
      email,
      password: hashed,
      avatar: result.secure_url,
    });

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    await unlink(file.path);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
