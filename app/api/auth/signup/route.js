import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { writeFile, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import cloudinary from "@/lib/cloudinary";
import upload from "@/lib/multer";

// Needed to disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert Next route to use Multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export async function POST(req) {
  await dbConnect();

  const formData = {};

  // Convert to Express-compatible req/res
  const { readable, headers } = req;
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const reqBody = new Request("http://localhost", {
    method: "POST",
    body: buffer,
    headers,
  });

  const res = {
    setHeader: () => {},
    end: () => {},
  };

  // Use multer to extract file
  await runMiddleware(reqBody, res, upload.single("avatar"));

  const { username, email, password } = reqBody.body;
  const file = reqBody.file;

  if (!username || !email || !password || !file) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return NextResponse.json(
      { message: "Username or email already exists" },
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const localPath = path.join(process.cwd(), "public", "temp", file.filename);

  try {
    const cloudinaryResult = await cloudinary.uploader.upload(localPath, {
      folder: "chatapp/avatars",
      width: 200,
      crop: "thumb",
    });

    await unlink(localPath); // remove temp file

    const user = await User.create({
      username,
      email,
      password: hash,
      avatar: cloudinaryResult.secure_url,
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
