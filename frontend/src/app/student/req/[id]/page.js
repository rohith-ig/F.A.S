"use client"
import Link from "next/link";
import { useState } from "react";
import { getFacultyById, getFacultySlotsForNextDays } from "../../search/facultyData";
import { useParams } from "next/navigation";
import BackArrowButton from "@/components/BackArrowButton";
import { Calendar, Users, Repeat, FileText, CheckCircle2, MapPin, Tag } from "lucide-react";

export default function RequestFacultyPage({ params }) {
  const { id } = useParams();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("30");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const faculty = getFacultyById(id);

  if (!faculty) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] px-4 ">
        <section className="mx-auto w-full max-w-3xl rounded-lg border border-[#E0E0E0] bg-white p-8 shadow-sm">
          <div className="mb-4">
            <BackArrowButton />
          </div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Faculty Not Found</h1>
          <p className="mt-2 text-sm text-[#5A6C7D]">
            The selected faculty ID does not exist in the demo data.
          </p>
          <Link
            href="/student/req"
            className="mt-5 inline-flex rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white"
          >
            Back to Faculty Profiles
          </Link>
        </section>
      </main>
    );
  }

  const slots = getFacultySlotsForNextDays(faculty, 5);
  const groupedSlots = slots.reduce((acc, slot) => {
    const [dateLabel, timeRange] = slot.split(" | ");

    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }

    acc[dateLabel].push(timeRange || slot);
    return acc;
  }, {});

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-[#F7F9FC] px-4 py-8">
        <section className="mx-auto w-full max-w-2xl rounded-2xl border border-[#DCE3ED] bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Request Sent Successfully!</h1>
          <p className="mt-2 text-[#5A6C7D]">
            Your appointment request has been forwarded to <span className="font-semibold">{faculty.name}</span>. You will be notified once it is reviewed.
          </p>

          <div className="mt-8 text-left rounded-xl border border-[#DCE3ED] bg-[#F8FAFC] p-6 text-sm">
            <h3 className="font-bold text-[#1F3A5F] mb-4 border-b border-[#DCE3ED] pb-2">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="font-semibold text-[#1F3A5F]">{purpose || "General"}</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Duration</p>
                <p className="font-semibold text-[#1F3A5F]">{duration} Minutes</p>
              </div>
              <div>
                <p className="text-xs text-[#5A6C7D] uppercase tracking-wider">Meeting Type</p>
                <p className="font-semibold text-[#1F3A5F]">
                  {[isGroupMeeting ? "Group" : "", isRecurringMeeting ? "Recurring" : ""].filter(Boolean).join(", ") || "Standard 1-on-1"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/student"
              className="w-full sm:w-auto rounded-lg bg-[#1F3A5F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2A4A75] shadow-sm text-center"
            >
              Go to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedSlot("");
                setIsGroupMeeting(false);
                setIsRecurringMeeting(false);
                setPurpose("");
                setDuration("30");
                setRequestId("");
              }}
              className="w-full sm:w-auto rounded-lg border border-[#DCE3ED] bg-white px-6 py-3 text-sm font-semibold text-[#1F3A5F] hover:bg-[#F8FAFC] transition"
            >
              Book Another
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4">
      <section className="mx-auto w-full max-w-4xl">
        {/* Faculty Header Card */}
        <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {faculty.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1F3A5F]">{faculty.name}</h1>
                <p className="text-sm font-medium text-[#4A6FA5]">{faculty.department}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 sm:ml-15 text-sm text-[#5A6C7D]">
              <span className="flex items-center gap-1.5"><Tag size={16} className="text-[#A8BCD6]" /> Focus: {faculty.focus}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#A8BCD6]" /> Loc: {faculty.location}</span>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          {/* Slots & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Time Slots */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-[#F0F4F8] pb-4">
                  <Calendar className="text-[#4A6FA5]" size={20} />
                  <h2 className="text-lg font-bold text-[#1F3A5F]">Select Date & Time</h2>
                </div>

                <div className="space-y-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(groupedSlots).map(([dateLabel, dateSlots]) => (
                    <div key={dateLabel}>
                      <p className="text-sm font-bold text-[#5A6C7D] mb-3">{dateLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        {dateSlots.map((timeRange) => {
                          const slotValue = `${dateLabel} | ${timeRange}`;
                          const isSelected = selectedSlot === slotValue;
                          const displayTime = timeRange.split(' - ')[0] || timeRange;

                          return (
                            <label key={slotValue} className="cursor-pointer">
                              <input
                                type="radio"
                                name="slot"
                                value={slotValue}
                                onChange={() => setSelectedSlot(slotValue)}
                                className="peer sr-only"
                              />
                              <span className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-[#F8FAFC] border-[#DCE3ED] text-[#415A75] hover:border-indigo-300 hover:bg-white'}`}>
                                {displayTime}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedSlot || !purpose || !duration}
                  className={`w-full sm:w-auto rounded-xl px-10 py-3.5 text-sm font-bold text-white transition-all shadow-sm ${(selectedSlot && purpose && duration)
                    ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-[#9AAABC] opacity-70"
                    }`}
                  onClick={() => {
                    if (!selectedSlot || !purpose || !duration) return;
                    const generatedId = `REQ-${Date.now().toString().slice(-6)}`;
                    setRequestId(generatedId);
                    setIsSubmitted(true);
                  }}
                >
                  Confirm Appointment
                </button>
              </div>
            </div>

            {/* Right Column: Meeting Options & Notes */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5 border-b border-[#F0F4F8] pb-4">
                  <FileText className="text-[#4A6FA5]" size={20} />
                  <h2 className="text-lg font-bold text-[#1F3A5F]">Meeting Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A6C7D] mb-2">Purpose</label>
                    <div className="relative">
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-[#DCE3ED] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#1F3A5F] outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                      >
                        <option value="" disabled>Select a reason...</option>
                        <option value="Project Review">Project Review</option>
                        <option value="Thesis Discussion">Thesis Discussion</option>
                        <option value="Doubt Clearance">Doubt Clearance</option>
                        <option value="General Advising">General Advising</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5A6C7D]">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5A6C7D] mb-2">Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['15', '30', '45', '60'].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          className={`rounded-lg border px-2 py-2 text-sm font-medium transition-all ${duration === mins ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-[#F8FAFC] border-[#DCE3ED] text-[#415A75] hover:border-indigo-300 hover:bg-white'}`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3">
                    <label className={`flex items-center justify-between cursor-pointer rounded-xl border p-3 transition-colors ${isGroupMeeting ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-[#DCE3ED] hover:bg-[#F8FAFC]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isGroupMeeting ? 'bg-indigo-100 text-indigo-700' : 'bg-[#E8EEF5] text-[#5A6C7D]'}`}>
                          <Users size={16} />
                        </div>
                        <span className="text-sm font-medium text-[#1F3A5F]">Group Meeting</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isGroupMeeting}
                        onChange={(e) => setIsGroupMeeting(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hidden"
                      />
                    </label>

                    <label className={`flex items-center justify-between cursor-pointer rounded-xl border p-3 transition-colors ${isRecurringMeeting ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-[#DCE3ED] hover:bg-[#F8FAFC]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isRecurringMeeting ? 'bg-indigo-100 text-indigo-700' : 'bg-[#E8EEF5] text-[#5A6C7D]'}`}>
                          <Repeat size={16} />
                        </div>
                        <span className="text-sm font-medium text-[#1F3A5F]">Recurring Weekly</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isRecurringMeeting}
                        onChange={(e) => setIsRecurringMeeting(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hidden"
                      />
                    </label>
                  </div>

                  <div className="pt-3">
                    <label htmlFor="note" className="block text-xs font-bold uppercase tracking-wider text-[#5A6C7D] mb-2">
                      Agenda / Notes
                    </label>
                    <textarea
                      id="note"
                      rows={3}
                      placeholder="Briefly describe what you'd like to discuss..."
                      className="w-full rounded-xl border border-[#DCE3ED] bg-[#F8FAFC] px-4 py-3 text-sm text-[#1F3A5F] outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
