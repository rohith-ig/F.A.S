"use client";
  import { useEffect, useState } from "react";


// Standalone admin page.
// Will be wrapped by app/admin/layout.js later.

export default function ResolveTicketsPage() {
  const [openTicketId, setOpenTicketId] = useState(null);


const [tickets, setTickets] = useState([]);
const [view, setView] = useState("active");

const getTokenFromCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

useEffect(() => {
  const fetchTickets = async () => {
  const token = getTokenFromCookie();
  const res = await fetch("http://localhost:6969/api/tickets/view-tickets", { 
    credentials: "include", 
    headers: { "Authorization": `Bearer ${token}` } // Inject here
  });

    const data = await res.json();
    setTickets(data);
  };

  fetchTickets();
}, []);


const handleResolve = async (id) => {
  const token = getTokenFromCookie();
  await fetch(`http://localhost:6969/api/tickets/resolveTicket/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Authorization": `Bearer ${token}` } ,
  });

  // refresh
  setTickets(prev =>
    prev.map(t =>
      t.id === id ? { ...t, ticketStatus: "RESOLVED" }: t
    )
  );
};


const activeTickets = tickets.filter(
  t => t.ticketStatus?.toUpperCase() === "OPEN"
);

const resolvedTickets = tickets.filter(
  t => t.ticketStatus?.toUpperCase() === "RESOLVED"
);

const currentTickets =
  view === "active" ? activeTickets : resolvedTickets;


return (
  <main className="min-h-screen bg-[#F7F9FC] px-4 md:px-6 py-8 animate-fadeIn">
    {/* Container */}
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1F3A5F]">
          Support Tickets
        </h1>
        <p className="text-sm text-[#4A6FA5] mt-1">
          Review and resolve issues raised by students and faculty.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex gap-3 mb-8">
        {["active", "resolved"].map((type) => (
          <button
            key={type}
            onClick={() => setView(type)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === type
                ? "bg-[#1F3A5F] text-white shadow-sm"
                : "bg-white border border-[#E0E0E0] text-[#1F3A5F] hover:bg-gray-50"
            }`}
          >
            {type === "active" ? "Active" : "Resolved"}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <section className="space-y-4">
        {/* Table Header */}
<div className="grid md:grid-cols-5 gap-4 px-5 py-3 mb-2 text-xs font-semibold text-[#1F3A5F] uppercase tracking-wide">
  <div>Raised By</div>
  <div className="md:col-span-2">Title</div>
  <div>Date</div>
  <div className="text-right md:text-left">Action</div>
</div>


        {currentTickets.length === 0 ? (
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-10 text-center text-[#4A6FA5] text-sm">
            No tickets found in this category.
          </div>
        ) : (
          currentTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white border border-[#E0E0E0] rounded-xl transition-all duration-200 hover:shadow-sm"
            >

              {/* Row */}
              <div className="grid md:grid-cols-5 gap-4 px-5 py-4 items-center">

                {/* Raised By */}
                <div>
                  <p className="text-sm text-[#1F3A5F] font-medium mt-1">
                    {ticket.user?.studentProfile?.roll || ticket.user?.name}
                  </p>
                </div>

                {/* Title */}
                <div className="md:col-span-2">
      
                  <p className="text-sm text-[#1F3A5F] mt-1">
                    {ticket.topic}
                  </p>
                </div>

                {/* Date */}
                <div>
    
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3">

                  {view === "active" && (
                    <button
                      onClick={() => handleResolve(ticket.id)}
                      className="px-3 py-1.5 text-xs bg-[#1F3A5F] text-white rounded-md hover:bg-[#2A4A75] transition"
                    >
                      Resolve
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setOpenTicketId(
                        openTicketId === ticket.id ? null : ticket.id
                      )
                    }
                    className="text-[#4A6FA5] hover:text-[#1F3A5F] transition text-sm"
                  >
                    {openTicketId === ticket.id ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {/* Description */}
<div
  className={`transition-all duration-300 ease-in-out ${
    openTicketId === ticket.id
      ? "max-h-60 opacity-100"
      : "max-h-0 opacity-0"
  } overflow-hidden`}
>
  <div className="px-5 pb-5 pt-2">
    <div className="bg-[#F7F9FC] border border-[#E0E0E0] rounded-lg p-4">
      <p className="text-xs font-semibold text-[#2A4A75] mb-2 tracking-wide">
        DESCRIPTION
      </p>

      <div className="max-h-40 overflow-y-auto pr-1">
        <p className="text-sm text-[#4A6FA5] leading-relaxed whitespace-pre-wrap break-words">
          {ticket.description || "No description provided."}
        </p>
      </div>

    </div>
  </div>
</div>


            </div>
          ))
        )}

      </section>
    </div>
  </main>
);

}

