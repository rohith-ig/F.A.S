"use client";

import React, { useState } from "react";

/**
 * Custom Modal for Cancellation Reasons (Approved Appointments)
 */
const CancelModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A5F]/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E0E0E0] w-full max-w-md overflow-hidden animate-fade-up">
        <div className="p-6 border-b border-[#E0E0E0]">
          <h3 className="text-[#1F3A5F] font-bold text-lg">
            Cancel Appointment
          </h3>
          <p className="text-[#4A6FA5] text-sm mt-1">
            Please provide a reason for the faculty member.
          </p>
        </div>
        <div className="p-6">
          <textarea
            autoFocus
            className="w-full border border-[#E0E0E0] rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#4A6FA5] focus:border-transparent outline-none transition-all"
            rows="4"
            placeholder="e.g., Medical emergency, schedule conflict..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="p-4 bg-[#F7F9FC] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#4A6FA5]"
          >
            Go Back
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className="px-6 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple Confirmation Modal (Pending Withdrawals)
 */
const WithdrawModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A5F]/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E0E0E0] w-full max-w-sm p-6 text-center animate-fade-up">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold italic">
          !
        </div>
        <h3 className="text-[#1F3A5F] font-bold text-lg">Withdraw Request?</h3>
        <p className="text-[#4A6FA5] text-sm mt-2 mb-6">
          Are you really sure? This request will be permanently deleted and
          cannot be undone.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Yes, Withdraw Request
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-[#4A6FA5] font-semibold hover:bg-slate-50 rounded-lg"
          >
            Keep Request
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentCard = ({
  appointment,
  onCancelRequested,
  onWithdrawRequested,
}) => {
  const { facultyName, note, time, date, status, cancelledBy, cancelReason } =
    appointment;

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-300",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#1F3A5F] font-bold text-xl tracking-tight">
            {facultyName}
          </h3>
          <p className="text-sm font-medium text-[#4A6FA5] mt-1">
            {date} • {time}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${statusStyles[status]}`}
        >
          {status === "cancelled" ? `Cancelled by ${cancelledBy}` : status}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-[#2A4A75] text-sm leading-relaxed italic italic">
          "{note || "No notes provided."}"
        </p>
        {cancelReason && (
          <div className="mt-3 p-3 bg-rose-50/50 border-l-2 border-rose-200 rounded-r-lg">
            <p className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">
              Reason for Cancellation:
            </p>
            <p className="text-xs text-rose-700 italic mt-0.5">
              {cancelReason}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-[#E0E0E0] pt-4">
        {status === "approved" && (
          <button
            onClick={() => onCancelRequested(appointment.id)}
            className="text-sm font-bold text-[#4A6FA5] hover:text-rose-600 transition-colors"
          >
            Cancel Appointment
          </button>
        )}
        {status === "pending" && (
          <button
            onClick={() => onWithdrawRequested(appointment.id)}
            className="text-sm font-bold text-amber-600 hover:text-rose-600 transition-colors"
          >
            Withdraw Request
          </button>
        )}
      </div>
    </div>
  );
};

export default function FacultyDashboard() {
  const [filter, setFilter] = useState("upcoming");
  const [activeId, setActiveId] = useState(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      facultyName: "Dr. Sarah Mitchell",
      note: "Discussing thesis methodology",
      time: "10:30 AM",
      date: "Oct 24, 2026",
      status: "approved",
    },
    {
      id: 2,
      facultyName: "Prof. James Wilson",
      note: "Lab orientation",
      time: "02:00 PM",
      date: "Oct 28, 2026",
      status: "pending",
    },
    {
      id: 3,
      facultyName: "Dr. Aris Thorne",
      note: "Grade review",
      time: "09:00 AM",
      date: "Oct 20, 2025",
      status: "cancelled",
      cancelledBy: "faculty",
      cancelReason: "Emergency faculty meeting.",
    },
  ]);

  const handleWithdraw = () => {
    setAppointments(appointments.filter((app) => app.id !== activeId));
    setIsWithdrawOpen(false);
  };

  const handleCancel = (reason) => {
    setAppointments(
      appointments.map((app) =>
        app.id === activeId
          ? {
              ...app,
              status: "cancelled",
              cancelledBy: "student",
              cancelReason: reason,
            }
          : app,
      ),
    );
    setIsCancelOpen(false);
  };

  const filteredData = appointments.filter((app) => {
    if (filter === "upcoming")
      return app.status === "pending" || app.status === "approved";
    if (filter === "past")
      return app.status === "cancelled" || app.status === "rejected";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans flex flex-col items-center py-10 px-4">
      <CancelModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onConfirm={handleWithdraw}
      />

      <main className="w-full max-w-[800px] z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] overflow-hidden flex flex-col min-h-[80vh]">
          <div className="p-8 border-b border-[#E0E0E0] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1F3A5F] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#1F3A5F]/20">
                FS
              </div>
              <div>
                <h1 className="text-[#1F3A5F] font-bold text-2xl tracking-tight">
                  Faculty Scheduler
                </h1>
                <p className="text-[#4A6FA5] text-sm font-medium uppercase tracking-widest opacity-80 text-[10px]">
                  Student Dashboard
                </p>
              </div>
            </div>

            <nav className="flex bg-[#F8FAFC] p-1 rounded-xl border border-[#E0E0E0]">
              {["all", "upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${filter === tab ? "text-[#1F3A5F] bg-white shadow-sm ring-1 ring-black/5" : "text-[#4A6FA5] hover:text-[#2A4A75]"}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-8">
            {filteredData.length > 0 ? (
              filteredData.map((app) => (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  onCancelRequested={(id) => {
                    setActiveId(id);
                    setIsCancelOpen(true);
                  }}
                  onWithdrawRequested={(id) => {
                    setActiveId(id);
                    setIsWithdrawOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 pointer-events-none">
                <h2 className="text-6xl font-black text-[#1F3A5F] rotate-[-2deg]">
                  EMPTY QUEUE
                </h2>
                <p className="text-lg font-bold text-[#1F3A5F]">
                  No appointments here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}