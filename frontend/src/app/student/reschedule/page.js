"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function RescheduleContent() {
  const searchParams = useSearchParams();
  const facultyName = searchParams.get("name") || "Dr. Raju";

  // State
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId] = useState(`REQ-${Math.floor(Math.random() * 900000 + 100000)}`);

  // Dummy Slots
  const availableDates = [
    { date: "Mon, Mar 9", times: ["10:00 AM", "2:00 PM", "4:30 PM"] },
    { date: "Tue, Mar 10", times: ["10:00 AM", "2:00 PM", "4:30 PM"] },
    { date: "Wed, Mar 11", times: ["10:00 AM", "2:00 PM", "4:30 PM"] },
    { date: "Thu, Mar 12", times: ["10:00 AM", "2:00 PM", "4:30 PM"] },
  ];

  // --- 1. SUCCESS VIEW ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-start justify-center p-4 pt-12">
        <div className="bg-white border border-[#DCE3ED] rounded-2xl shadow-sm max-w-2xl w-full p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="text-2xl font-bold text-[#1F3A5F] mb-2">Request Sent Successfully!</h1>
          <p className="text-[#5A6C7D] mb-8 max-w-lg">
            Your appointment request has been forwarded to <span className="font-semibold">{facultyName}</span>. You will be notified once it is reviewed.
          </p>

          <div className="w-full bg-[#F8FAFC] border border-[#DCE3ED] rounded-xl p-6 text-left">
            <h3 className="text-[#1F3A5F] font-bold text-sm mb-4 border-b border-[#DCE3ED] pb-2 uppercase tracking-wider">Appointment Details</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Request ID</p>
                <p className="font-semibold text-[#1F3A5F]">{requestId}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Time Slot</p>
                <p className="font-semibold text-[#1F3A5F]">{selectedSlot}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Purpose</p>
                <p className="font-semibold text-[#1F3A5F]">Reschedule Request</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Duration</p>
                <p className="font-semibold text-[#1F3A5F]">30 Minutes</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <Link href="/student" className="bg-[#1F3A5F] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#2A4A75] transition-all text-center">
              Go to Dashboard
            </Link>
            <button onClick={() => setIsSubmitted(false)} className="bg-white border border-[#DCE3ED] text-[#1F3A5F] px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#F8FAFC] transition-all">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. SELECTION VIEW ---
  return (
    <div className="min-h-screen bg-[#F7F9FC] p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white border border-[#DCE3ED] rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-[#F0F4F8] pb-4 text-[#1F3A5F]">
          <Calendar size={20} className="text-[#4A6FA5]" />
          <h2 className="text-lg font-bold">Select Date & Time</h2>
        </div>

        <div className="space-y-5">
          {availableDates.map((dateObj) => (
            <div key={dateObj.date}>
              <h3 className="text-sm font-bold text-[#5A6C7D] mb-3">{dateObj.date}</h3>
              <div className="flex flex-wrap gap-2">
                {dateObj.times.map((time) => {
                  const slotString = `${dateObj.date} | ${time}`;
                  const isSelected = selectedSlot === slotString;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedSlot(slotString)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-[#F8FAFC] text-[#415A75] border-[#DCE3ED] hover:border-indigo-300 hover:bg-white"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-2">
          <button
            disabled={!selectedSlot}
            onClick={() => setIsSubmitted(true)}
            className={`w-full sm:w-auto px-10 py-3.5 text-sm font-bold text-white rounded-xl shadow-sm transition-all ${
              selectedSlot 
                ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5" 
                : "bg-[#9AAABC] opacity-70 cursor-not-allowed"
            }`}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
export default function ReschedulePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RescheduleContent />
    </Suspense>
  );
}