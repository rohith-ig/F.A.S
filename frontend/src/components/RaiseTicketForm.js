"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function RaiseTicketForm({ role }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);

  const getTokenFromCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = getTokenFromCookie(); // 1. Get token
  const res = await fetch("http://localhost:6969/api/tickets/create-ticket", {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` // 2. Add token here
    }, 
    body: JSON.stringify({
      topic:title,
      description:description,
    }),
  });

  if (res.ok) {
    alert("Ticket created!");
    router.push("/student/tickets");

  }
};

const router = useRouter();


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#1F3A5F]">
          Issue Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
          className="mt-1 w-full rounded-md border border-[#E0E0E0] px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#1F3A5F]">
          Description
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the issue in detail"
          className="mt-1 w-full rounded-md border border-[#E0E0E0] px-3 py-2 text-sm"
        />
      </div>

      {/* Optional Attachment */}
      <div>
        <label className="block text-sm font-medium text-[#1F3A5F] mb-1">
            Attach Screenshot / File (optional)
        </label>

      <div className="flex items-center gap-3">
        <label
        htmlFor="attachment"
        className="cursor-pointer rounded-md border border-[#4A6FA5] px-4 py-2 text-sm text-[#4A6FA5] transition hover:bg-[#4A6FA5]/10"
        >
            Choose File
        </label>

        <span className="text-xs text-[#6E8196]">
          {attachment ? attachment.name : "No file selected"}
        </span>
      </div>

      <input
        id="attachment"
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setAttachment(e.target.files?.[0] || null)}
        className="hidden"
      />

      <p className="mt-1 text-xs text-[#6E8196]">
        Upload screenshots or documents to help explain the issue.
      </p>
    </div>


      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-[#1F3A5F] px-4 py-2 text-sm text-white hover:bg-[#2A4A75] cursor-pointer"
        >
          Submit Ticket
        </button>

        <button
          type="reset"
          className="rounded-md border border-[#E0E0E0] px-4 py-2 text-sm cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
