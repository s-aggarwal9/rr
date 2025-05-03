// components/CreateGroupChat.js

"use client";

import { useState } from "react";

export default function CreateGroupChat({ currentUserId }) {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleCreateGroup = async () => {
    if (!groupName || selectedUserIds.length < 1) return;

    try {
      const res = await fetch("/api/chats/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          participantIds: [currentUserId, ...selectedUserIds],
        }),
      });

      const chat = await res.json();
      // Navigate to group chat interface with chat._id
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      {/* Implement user selection UI to populate selectedUserIds */}
      <button onClick={handleCreateGroup}>Create Group Chat</button>
    </div>
  );
}
