import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing credentials" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = await generateToken({ id: user._id });

  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );
  response.cookies.set("token", token, {
    httpOnly: false,
    // httpOnly: true, yeh nautanki karta rehta.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

// import { dbConnect } from "@/lib/db";
// import User from "@/models/User.model";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();

//   const { email, password } = await req.json();

//   if (!email || !password) {
//     return NextResponse.json(
//       { message: "Missing credentials" },
//       { status: 400 }
//     );
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     return NextResponse.json(
//       { message: "Invalid email or password" },
//       { status: 401 }
//     );
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return NextResponse.json(
//       { message: "Invalid email or password" },
//       { status: 401 }
//     );
//   }

//   console.log("signing token with:", process.env.JWT_SECRET);

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   console.log("setting token", token);

//   const response = NextResponse.json(
//     { message: "Login successful" },
//     { status: 200 }
//   );
//   response.cookies.set("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return response;
// }
