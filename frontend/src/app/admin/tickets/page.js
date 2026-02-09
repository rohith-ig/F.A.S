"use client";

// Standalone admin page for managing support tickets raised by students and faculty.
// should be wrapped by app/admin/layout.js later

export default function ResolveTicketsPage() {
  const tickets = [
    {
      id: 1,
      title: "Unable to reschedule appointment",
      raisedBy: "Student",
      name: "Muhammed Nubaise",
      status: "Open",
    },
    {
      id: 2,
      title: "Calendar sync not updating",
      raisedBy: "Faculty",
      name: "Dr. Anil Kumar",
      status: "Open",
    },
    {
      id: 3,
      title: "Duplicate appointment created",
      raisedBy: "Student",
      name: "Ayesha Rahman",
      status: "Pending",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1F3A5F]">
          Support Tickets
        </h1>
        <p className="text-sm text-[#4A6FA5]">
          Review and resolve issues raised by students and faculty.
        </p>
      </div>

      {/* Stats Row (matches dashboard style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Open Tickets" value="7" />
        <StatCard label="Pending Review" value="3" />
        <StatCard label="Resolved Today" value="4" />
      </div>

      {/* Tickets Table (card-style like dashboard) */}
      <section className="bg-white border border-[#E0E0E0] rounded-xl">
        <div className="px-6 py-4 border-b border-[#E0E0E0]">
          <h2 className="text-sm font-medium text-[#1F3A5F]">
            Active Tickets
          </h2>
        </div>

        <div className="divide-y divide-[#E0E0E0]">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[#1F3A5F]">
                  {ticket.title}
                </p>
                <p className="text-xs text-[#4A6FA5] mt-0.5">
                  Raised by {ticket.raisedBy} · {ticket.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-1 rounded-full border border-[#E0E0E0] text-[#2A4A75]">
                  {ticket.status}
                </span>
                <button className="text-xs font-medium text-[#1F3A5F] hover:underline">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-lg px-5 py-4">
      <p className="text-xs text-[#4A6FA5] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xl font-semibold text-[#1F3A5F] mt-1">
        {value}
      </p>
    </div>
  );
}
