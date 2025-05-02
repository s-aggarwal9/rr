import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/chat", "/profile"];

async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await jwtVerify(token, secret);
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/profile/:path*"],
};

// // middleware.js
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const protectedRoutes = ["/chat", "/profile"]; // add more as needed

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   console.log("Verifying token with:", process.env.JWT_SECRET);

//   const { pathname } = req.nextUrl;

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       console.log("vrifying token", token);
//       return NextResponse.next();
//     } catch (err) {
//       console.log("vrifying token", token);
//       console.log("secret", process.env.JWT_SECRET);
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// // Apply middleware only to app routes (no API or static files)
// export const config = {
//   matcher: ["/chat/:path*", "/profile/:path*"], // adjust based on your app
// };
