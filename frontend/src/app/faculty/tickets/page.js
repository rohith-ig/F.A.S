"use client";

import { useState } from "react";
import Link from "next/link";

export default function StudentTickets() {
  const [view, setView] = useState("open");

  const openTickets = [
    { id: "TCK-1021", date: "10 Mar 2026", topic: "Unable to book appointment", status: "Open" },
    { id: "TCK-1024", date: "11 Mar 2026", topic: "Student not visible in scheduler", status: "Open" }
  ];

  const closedTickets = [
    { id: "TCK-1003", date: "05 Mar 2026", topic: "Calendar sync issue", status: "Resolved" },
    { id: "TCK-1007", date: "06 Mar 2026", topic: "Login error", status: "Resolved" }
  ];

  const tickets = view === "open" ? openTickets : closedTickets;

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-inter p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* Page Heading + Button */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-[#1F3A5F]">
            Support Tickets
          </h1>

          <Link
            href="/faculty/tickets/raise"
            className="px-5 py-2.5 rounded-lg bg-[#1F3A5F] text-white text-sm font-medium hover:bg-[#2A4A75] transition"
          >
            Raise Ticket
          </Link>
        </div>

        {/* Ticket Count */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
          <p className="text-lg text-gray-700">
            Total Tickets:{" "}
            <span className="font-semibold">
              {openTickets.length + closedTickets.length}
            </span>
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView("open")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              view === "open"
                ? "bg-[#1F3A5F] text-white"
                : "bg-white border border-[#E0E0E0]"
            }`}
          >
            Open Tickets
          </button>

          <button
            onClick={() => setView("closed")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              view === "closed"
                ? "bg-[#1F3A5F] text-white"
                : "bg-white border border-[#E0E0E0]"
            }`}
          >
            Closed Tickets
          </button>
        </div>

        {/* Ticket Table */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-4 bg-gray-50 text-sm font-medium text-gray-600 p-4">
            <div>Ticket Number</div>
            <div>Date Created</div>
            <div>Status</div>
            <div>Topic</div>
          </div>

          {/* Ticket Rows */}
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-4 p-4 border-t border-[#E0E0E0] text-sm items-center"
            >
              <div className="font-medium text-[#1F3A5F]">{ticket.id}</div>
              <div>{ticket.date}</div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.status === "Open"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <div>{ticket.topic}</div>
            </div>
          ))}

          {/* Empty State */}
          {tickets.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
              No tickets found.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}