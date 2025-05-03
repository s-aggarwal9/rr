"use client";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query.trim());
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function searchUsers(searchTerm) {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/users/search?q=${searchTerm}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to search");

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewChat = async (userId) => {
    try {
      console.log(userId);
      setIsLoading(true);
      const res = await fetch(`/api/chats/access`, {
        method: "POST",
        body: JSON.stringify({ userId }), // Sending the selected user ID to start a chat
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      console.log(
        "response from chat/acces/route received in search/page.js",
        data
      );
      if (data) {
        // Navigate to the chat page or show the chat list

        console.log("chat created succesfully", data, data._id);

        // router.push(`/chats/${data.chat._id}`);
      } else {
        console.error("Error creating or fetching the chat.");
      }
    } catch (err) {
      console.error("error while creating chat from search page", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">🔍 Search Users</h1>

        <input
          type="text"
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />

        {isLoading && (
          <p className="text-sm text-gray-500 mb-2">Searching...</p>
        )}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <ul className="space-y-4">
          {results.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded border"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
                onClick={() => handleNewChat(user._id)} // to be replaced
              >
                💬 Start Chat
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
