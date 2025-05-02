// lib/jwt.js
import { jwtVerify } from "jose";

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyJwt(token) {
  try {
    console.log("token from lib/jwt.js", token);
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

// import jwt from "jsonwebtoken";

// const SECRET = process.env.JWT_SECRET;

// export function signJwt(payload) {
//   return jwt.sign(payload, SECRET, { expiresIn: "7d" });
// }

// export function verifyJwt(token) {
//   try {
//     return jwt.verify(token, SECRET);
//   } catch {
//     return null;
//   }
// }
