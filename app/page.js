// app/page.js
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import UserModel from "@/models/User.model";
import { dbConnect } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user;

  try {
    const jwtRes = await verifyJwt(token);
    const id = jwtRes?.id;
    user = await UserModel.findById(id).select("-password");
    console.log("user from app/page.js", user);
  } catch (err) {
    console.error("Invalid token in HomePage");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome 👋</h1>
        {user ? (
          <>
            <p className="mb-2 text-gray-700">Logged in as:</p>
            <p className="font-mono text-sm text-blue-600">
              {user.email || user.id}
            </p>

            <div className="mt-6 space-y-2">
              <Link
                href="/search"
                className="block bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                🔍 Search Users
              </Link>
              <a
                href="/chats"
                className="block bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                💬 View Chats
              </a>
              <a
                href="/logout"
                className="block bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                🚪 Logout
              </a>
            </div>
          </>
        ) : (
          <p className="text-red-500">
            Authentication failed. Please log in again.
          </p>
        )}
      </div>
    </main>
  );
}
