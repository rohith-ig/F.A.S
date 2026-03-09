"use client";

import { useMemo, useState } from "react";
import BackArrowButton from "@/components/BackArrowButton";

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const quickSlotTemplates = [
  "9:00 AM - 9:30 AM",
  "10:00 AM - 10:30 AM",
  "11:30 AM - 12:00 PM",
  "2:00 PM - 2:30 PM",
  "3:00 PM - 3:30 PM",
  "4:30 PM - 5:00 PM",
];
const timeOptions = [
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
];

const departmentAssignedByWeekday = {
  Mon: [
    { title: "CS201 - Algorithms", kind: "Class", time: "9:00 AM - 10:00 AM", place: "Block A · 201" },
    { title: "CS390 - Project Lab", kind: "Lab", time: "2:00 PM - 4:00 PM", place: "Lab 3" },
  ],
  Tue: [
    { title: "CS307 - OS", kind: "Class", time: "11:00 AM - 12:00 PM", place: "Block B · 118" },
    { title: "Department Coordination", kind: "Meeting", time: "4:00 PM - 5:00 PM", place: "Dean Office" },
  ],
  Wed: [
    { title: "CS201 - Algorithms", kind: "Class", time: "9:00 AM - 10:00 AM", place: "Block A · 201" },
    { title: "CS455 - Seminar", kind: "Meeting", time: "3:00 PM - 4:00 PM", place: "Seminar Hall" },
  ],
  Thu: [{ title: "CS307 - OS", kind: "Class", time: "11:00 AM - 12:00 PM", place: "Block B · 118" }],
  Fri: [{ title: "CS390 - Project Lab", kind: "Lab", time: "2:00 PM - 4:00 PM", place: "Lab 3" }],
  Sat: [],
  Sun: [],
};

const relativeAppointments = [
  { id: "A-301", dayOffset: -1, student: "Neha S", title: "Course Advising", time: "1:30 PM - 2:00 PM" },
  { id: "A-302", dayOffset: 0, student: "Arun K", title: "Project Review", time: "10:00 AM - 10:30 AM" },
  { id: "A-303", dayOffset: 1, student: "Group (3 students)", title: "Lab Clarification", time: "3:00 PM - 3:30 PM" },
  { id: "A-304", dayOffset: 2, student: "Sonia P", title: "Thesis Check-in", time: "4:30 PM - 5:00 PM" },
  { id: "A-305", dayOffset: 4, student: "Akhil R", title: "Internship Guidance", time: "2:00 PM - 2:30 PM" },
  { id: "A-306", dayOffset: 6, student: "Group (2 students)", title: "Project Milestone", time: "11:30 AM - 12:00 PM" },
];

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function fromDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLong(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function buildMonthCells(visibleMonth) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const cells = [];
  for (let i = 0; i < first.getDay(); i += 1) cells.push(null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toMinutes(timeLabel) {
  const [time, period] = timeLabel.split(" ");
  const [hourRaw, minuteRaw] = time.split(":").map(Number);
  let hour = hourRaw % 12;
  if (period === "PM") hour += 12;
  return hour * 60 + minuteRaw;
}

function parseRange(rangeLabel) {
  const [startRaw, endRaw] = rangeLabel.split("-").map((part) => part.trim());
  return [toMinutes(startRaw), toMinutes(endRaw)];
}

function rangesOverlap(firstRange, secondRange) {
  const [firstStart, firstEnd] = parseRange(firstRange);
  const [secondStart, secondEnd] = parseRange(secondRange);
  return firstStart < secondEnd && secondStart < firstEnd;
}

export default function FacultyScheduleViewPage() {
  const [today] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(today));

  // Master View Tab
  const [activeTab, setActiveTab] = useState("agenda"); // "agenda", "availability", "busy"

  const [customStart, setCustomStart] = useState("5:00 PM");
  const [customEnd, setCustomEnd] = useState("5:30 PM");
  const [availabilityTab, setAvailabilityTab] = useState("set");
  const [draftAvailabilityByDate, setDraftAvailabilityByDate] = useState({});
  const [saveNote, setSaveNote] = useState("");
  const [busyStart, setBusyStart] = useState("1:00 PM");
  const [busyEnd, setBusyEnd] = useState("5:00 PM");
  const [busyAction, setBusyAction] = useState("reschedule");

  const [availabilityByDate, setAvailabilityByDate] = useState(() => ({
    [toDateKey(today)]: ["10:00 AM - 10:30 AM", "2:00 PM - 2:30 PM"],
    [toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))]: [
      "11:30 AM - 12:00 PM",
    ],
  }));

  const appointments = useMemo(
    () =>
      relativeAppointments.map((item) => {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + item.dayOffset);
        return { ...item, dateKey: toDateKey(date) };
      }),
    [today],
  );

  const selectedDate = fromDateKey(selectedDateKey);
  const selectedWeekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(selectedDate);
  const monthCells = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth]);

  const todayStart = startOfDay(today);
  const selectedStart = startOfDay(selectedDate);
  const dayOffset = Math.floor((selectedStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
  const isPastDate = dayOffset < 0;
  const isBeyondWindow = dayOffset > 7;
  const canEditAvailability = dayOffset >= 0 && dayOffset <= 7;

  const busyRange = `${busyStart} - ${busyEnd}`;
  const isBusyRangeValid = toMinutes(busyEnd) > toMinutes(busyStart);

  const departmentItemsForDay = departmentAssignedByWeekday[selectedWeekday] ?? [];
  const appointmentsForDay = appointments.filter((item) => item.dateKey === selectedDateKey);
  const bookedSlotsForDay = appointmentsForDay.map((item) => item.time);
  const departmentBlockedRanges = departmentItemsForDay.map((item) => item.time);
  const blockedRangesForDay = [...bookedSlotsForDay, ...departmentBlockedRanges];
  const isSlotBlocked = (slot) => blockedRangesForDay.some((blockedRange) => rangesOverlap(slot, blockedRange));
  const availabilityForDay = availabilityByDate[selectedDateKey] ?? [];
  const draftSlotsBase = draftAvailabilityByDate[selectedDateKey] ?? availabilityForDay;
  const draftSlots = draftSlotsBase.filter((slot) => !isSlotBlocked(slot));

  const toggleSlot = (slot) => {
    if (!canEditAvailability) return;
    if (isSlotBlocked(slot)) return;
    setDraftAvailabilityByDate((prev) => {
      const current = prev[selectedDateKey] ?? availabilityForDay;
      const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...prev, [selectedDateKey]: next };
    });
  };

  const addCustomSlot = () => {
    if (!canEditAvailability) return;
    if (toMinutes(customEnd) <= toMinutes(customStart)) {
      setSaveNote("End time must be after start time.");
      return;
    }
    const value = `${customStart} - ${customEnd}`;
    if (isSlotBlocked(value)) {
      setSaveNote("This slot conflicts with booked/department-assigned time and cannot be added.");
      return;
    }
    setDraftAvailabilityByDate((prev) => {
      const current = prev[selectedDateKey] ?? availabilityForDay;
      if (current.includes(value)) return prev;
      return { ...prev, [selectedDateKey]: [...current, value] };
    });
    setSaveNote("");
  };

  const saveAvailability = () => {
    if (!canEditAvailability) return;
    setAvailabilityByDate((prev) => ({ ...prev, [selectedDateKey]: draftSlots }));
    setDraftAvailabilityByDate((prev) => ({ ...prev, [selectedDateKey]: draftSlots }));
    setSaveNote(`Availability set for ${formatDateLong(selectedDate)}.`);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6C8096] font-bold">Faculty Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-[#1F3A5F]">Schedule & Availability</h1>
              <p className="mt-2 text-sm text-[#5A6C7D]">
                Select a day from the calendar to view appointments, manage slots, or set exceptions.
              </p>
            </div>

            <div className="flex overflow-hidden rounded-xl border border-[#C8D3E0] bg-[#F8FAFC] p-1 shadow-inner h-[46px]">
              <button
                type="button"
                onClick={() => setActiveTab("agenda")}
                className={`flex-1 rounded-lg px-5 text-sm font-semibold transition-all ${activeTab === "agenda" ? "bg-white text-[#1F3A5F] shadow-sm" : "text-[#5A6C7D] hover:text-[#1F3A5F]"}`}
              >
                My Agenda
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("availability")}
                className={`flex-1 rounded-lg px-5 text-sm font-semibold transition-all ${activeTab === "availability" ? "bg-white text-[#1F3A5F] shadow-sm" : "text-[#5A6C7D] hover:text-[#1F3A5F]"}`}
              >
                Set Availability
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("busy")}
                className={`flex-1 rounded-lg px-5 text-sm font-semibold transition-all ${activeTab === "busy" ? "bg-white text-[#1F3A5F] shadow-sm" : "text-[#5A6C7D] hover:text-[#1F3A5F]"}`}
              >
                Override & Busy
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ALWAYS VISIBLE: The Calendar Mini-map (Occupies 5 cols on large screens) */}
          <article className="lg:col-span-5 rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm h-fit">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1F3A5F]">Calendar</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                    )
                  }
                  className="rounded-md border border-[#C8D3E0] bg-white px-3 py-1.5 text-sm text-[#2A4A75]"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                    )
                  }
                  className="rounded-md border border-[#C8D3E0] bg-white px-3 py-1.5 text-sm text-[#2A4A75]"
                >
                  Next
                </button>
              </div>
            </div>

            <p className="mb-3 text-sm text-[#5A6C7D]">
              {visibleMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </p>

            <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#6E8196]">
              {dayHeaders.map((day) => (
                <p key={day} className="py-1 font-medium">
                  {day}
                </p>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-2">
              {monthCells.map((date, idx) => {
                if (!date) {
                  return <div key={`empty-${idx}`} className="h-11 rounded-md bg-transparent" />;
                }

                const dateKey = toDateKey(date);
                const isSelected = dateKey === selectedDateKey;
                const dayAppointments = appointments.filter((item) => item.dateKey === dateKey).length;
                const dayAssignments =
                  departmentAssignedByWeekday[
                    new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
                  ]?.length ?? 0;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDateKey(dateKey)}
                    className={`relative h-11 rounded-md border text-sm transition ${isSelected
                      ? "border-[#1F3A5F] bg-[#1F3A5F] text-white"
                      : "border-[#DCE3ED] bg-white text-[#1F3A5F] hover:bg-[#F3F6FA]"
                      }`}
                  >
                    {date.getDate()}
                    {(dayAppointments > 0 || dayAssignments > 0) && (
                      <span
                        className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#4A6FA5]"
                          }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </article>


          {activeTab === "agenda" && (
            <article className="lg:col-span-7 rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1F3A5F]">{formatDateLong(selectedDate)}</h2>
              <p className="mt-1 text-sm text-[#5A6C7D]">Appointments and department-assigned schedule.</p>

              <div className="mt-4 rounded-md border border-[#DCE3ED] bg-[#FBFCFE] p-4">
                <h3 className="text-sm font-semibold text-[#1F3A5F]">Appointments</h3>
                {isBeyondWindow ? (
                  <p className="mt-2 text-sm text-[#5A6C7D]">
                    Outside 7-day window: appointment slots are not open yet.
                  </p>
                ) : appointmentsForDay.length === 0 ? (
                  <p className="mt-2 text-sm text-[#5A6C7D]">No appointments for this day.</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {appointmentsForDay.map((item) => (
                      <div key={item.id} className="rounded-md border border-[#DCE3ED] bg-white p-3 text-sm">
                        <p className="font-semibold text-[#1F3A5F]">{item.title}</p>
                        <p className="text-[#5A6C7D]">{item.time} · {item.student}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-md border border-[#DCE3ED] bg-[#FBFCFE] p-4">
                <h3 className="text-sm font-semibold text-[#1F3A5F]">Department Assigned Schedule</h3>
                {departmentItemsForDay.length === 0 ? (
                  <p className="mt-2 text-sm text-[#5A6C7D]">No department assignments for this day.</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {departmentItemsForDay.map((item) => (
                      <div key={`${item.title}-${item.time}`} className="rounded-md border border-[#DCE3ED] bg-white p-3 text-sm">
                        <p className="font-semibold text-[#1F3A5F]">{item.title}</p>
                        <p className="text-[#5A6C7D]">{item.kind} · {item.time} · {item.place}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )}

          {/* TAB 2: SET AVAILABILITY */}
          {activeTab === "availability" && (
            <article className="lg:col-span-7 rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm animate-fade-in">
              <h2 className="text-lg font-bold text-[#1F3A5F]">Manage Availability for {formatDateLong(selectedDate)}</h2>
              <p className="mt-1 text-sm text-[#5A6C7D]">
                Faculty can set or remove slots only for today and next 7 days.
              </p>
              <p className="mt-1 text-xs text-[#6E8196]">
                {canEditAvailability
                  ? "Editing enabled for this date."
                  : isPastDate
                    ? "Past date: read-only."
                    : "Beyond 7 days: read-only (department assignments only)."}
              </p>

              <div className="mt-4 flex overflow-hidden rounded-md border border-[#C8D3E0]">
                <button
                  type="button"
                  onClick={() => setAvailabilityTab("set")}
                  className={`flex-1 px-4 py-2 text-sm ${availabilityTab === "set" ? "bg-[#1F3A5F] text-white" : "bg-white text-[#1F3A5F]"}`}
                >
                  Set Availability
                </button>
                <button
                  type="button"
                  onClick={() => setAvailabilityTab("overview")}
                  className={`flex-1 px-4 py-2 text-sm ${availabilityTab === "overview" ? "bg-[#1F3A5F] text-white" : "bg-white text-[#1F3A5F]"}`}
                >
                  Available and Booked
                </button>
              </div>

              {availabilityTab === "set" && (
                <div className="mt-6 flex flex-col gap-6">
                  {/* Quick Slots */}
                  <section>
                    <h3 className="text-sm font-semibold text-[#1F3A5F] mb-3">Quick Slot Templates</h3>
                    <div className="flex flex-wrap gap-2">
                      {quickSlotTemplates.map((slot) => {
                        const selected = draftSlots.includes(slot);
                        const isBlocked = isSlotBlocked(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleSlot(slot)}
                            disabled={!canEditAvailability || isBlocked}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${isBlocked
                              ? "border border-[#E4B8B8] bg-[#FDECEC] text-[#B05555] cursor-not-allowed"
                              : selected
                                ? "bg-[#1F3A5F] text-white border border-[#1F3A5F]"
                                : "border border-[#DCE3ED] bg-white text-[#2A4A75] hover:bg-[#F8FAFC]"
                              } ${(!canEditAvailability || isBlocked) ? "opacity-60" : ""}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Custom Slots */}
                  <section>
                    <h3 className="text-sm font-semibold text-[#1F3A5F] mb-3">Add Custom Slot</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={customStart}
                          onChange={(e) => setCustomStart(e.target.value)}
                          className="w-full sm:w-32 rounded-lg border border-[#DCE3ED] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none focus:ring-2 focus:ring-[#1F3A5F]/20 focus:border-[#1F3A5F] transition"
                          disabled={!canEditAvailability}
                        >
                          {timeOptions.map((time) => (
                            <option key={`start-${time}`}>{time}</option>
                          ))}
                        </select>
                        <span className="text-[#5A6C7D]">to</span>
                        <select
                          value={customEnd}
                          onChange={(e) => setCustomEnd(e.target.value)}
                          className="w-full sm:w-32 rounded-lg border border-[#DCE3ED] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none focus:ring-2 focus:ring-[#1F3A5F]/20 focus:border-[#1F3A5F] transition"
                          disabled={!canEditAvailability}
                        >
                          {timeOptions.map((time) => (
                            <option key={`end-${time}`}>{time}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addCustomSlot}
                        disabled={!canEditAvailability}
                        className={`w-full sm:w-auto rounded-md px-5 py-2 text-sm font-medium transition-colors ${canEditAvailability ? "bg-[#F3F6FA] text-[#1F3A5F] border border-[#DCE3ED] hover:bg-[#E2E8F0]" : "bg-[#F3F6FA] text-[#9AAABC] border border-[#E2E8F0] cursor-not-allowed"
                          }`}
                      >
                        Add Custom Slot
                      </button>
                    </div>
                  </section>

                  {/* Selected Slots */}
                  <section className="rounded-xl border border-[#DCE3ED] bg-[#FBFCFE] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[#1F3A5F]">Draft Selections</h3>
                      {draftSlots.length > 0 && (
                        <span className="bg-[#EBF1F7] text-[#1F3A5F] text-xs font-semibold px-2 py-1 rounded-full">{draftSlots.length} slots</span>
                      )}
                    </div>

                    {draftSlots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-[#DCE3ED] bg-white rounded-md">
                        <p className="text-sm text-[#5A6C7D]">No slots selected yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {draftSlots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center gap-1 rounded-md border border-[#C8D3E0] bg-white pl-3 pr-1 py-1 text-sm text-[#2A4A75]"
                          >
                            <span className="font-medium">{slot}</span>
                            {canEditAvailability && (
                              <button
                                type="button"
                                onClick={() => toggleSlot(slot)}
                                className="ml-1 rounded-md p-1 text-[#9AAABC] hover:bg-[#F3F6FA] hover:text-[#B05555] transition-colors"
                                aria-label="Remove slot"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={saveAvailability}
                      disabled={!canEditAvailability}
                      className={`w-full sm:w-auto min-w-[200px] rounded-md px-6 py-2.5 text-sm font-semibold transition-colors ${canEditAvailability
                        ? "bg-[#1F3A5F] text-white hover:bg-[#2A4A75]"
                        : "bg-[#9AAABC] text-white cursor-not-allowed"
                        }`}
                    >
                      Save Availability
                    </button>
                    {saveNote && (
                      <div className="text-sm font-medium text-[#2E7D42]">
                        {saveNote}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {availabilityTab === "overview" && (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Available Slots */}
                  <div className="flex flex-col min-h-[150px] rounded-md border border-[#DCE3ED] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F3F6FA]">
                      <h3 className="text-sm font-semibold text-[#1F3A5F]">Available Slots</h3>
                      <span className="text-xs font-semibold text-[#5A6C7D] bg-[#F3F6FA] px-2.5 py-1 rounded-md">{availabilityForDay.length}</span>
                    </div>

                    {availabilityForDay.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-[#5A6C7D]">No available slots set.</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {availabilityForDay.map((slot) => (
                          <span
                            key={slot}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#F8FAFC] text-[#2A4A75] border border-[#C8D3E0]"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Blocked Slots */}
                  <div className="flex flex-col min-h-[150px] rounded-md border border-[#E9C5C5] bg-[#FFFBFB] p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FDECEC]">
                      <h3 className="text-sm font-semibold text-[#9A3E3E]">Blocked Slots</h3>
                      <span className="text-xs font-semibold text-[#9A3E3E] bg-[#FDECEC] px-2.5 py-1 rounded-md">{blockedRangesForDay.length}</span>
                    </div>

                    {blockedRangesForDay.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-[#7B5A5A]">No blocked slots.</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {blockedRangesForDay.map((slot) => (
                          <span
                            key={`blocked-${slot}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-[#FDECEC] text-[#B05555] border border-[#E4B8B8]"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          )}

          {/* TAB 3: OVERRIDE & BUSY */}
          {activeTab === "busy" && (
            <article className="lg:col-span-7 rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm animate-fade-in">
              <h2 className="text-lg font-bold text-[#1F3A5F]">Set Busy Status for {formatDateLong(selectedDate)}</h2>
              <p className="mt-1 text-sm text-[#5A6C7D]">
                Set busy status for this date. This action will trigger conflict handling in workflow.
              </p>

              <div className="mt-6 flex flex-col gap-6">
                {/* Time Selection */}
                <section>
                  <h3 className="text-sm font-semibold text-[#1F3A5F] mb-3">Time Window</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select
                        value={busyStart}
                        onChange={(e) => setBusyStart(e.target.value)}
                        className="w-full sm:w-40 rounded-lg border border-[#DCE3ED] bg-white px-3 py-2.5 text-sm text-[#1F3A5F] outline-none focus:ring-2 focus:ring-[#B05555]/20 focus:border-[#B05555] transition"
                        disabled={!canEditAvailability}
                      >
                        {timeOptions.map((time) => (
                          <option key={`busy-start-${time}`}>{time}</option>
                        ))}
                      </select>
                      <span className="text-[#5A6C7D] font-medium">to</span>
                      <select
                        value={busyEnd}
                        onChange={(e) => setBusyEnd(e.target.value)}
                        className="w-full sm:w-40 rounded-lg border border-[#DCE3ED] bg-white px-3 py-2.5 text-sm text-[#1F3A5F] outline-none focus:ring-2 focus:ring-[#B05555]/20 focus:border-[#B05555] transition"
                        disabled={!canEditAvailability}
                      >
                        {timeOptions.map((time) => (
                          <option key={`busy-end-${time}`}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Validation Note */}
                <section>
                  <div className={`flex items-start gap-3 rounded-md border p-4 transition-colors ${canEditAvailability && isBusyRangeValid
                      ? "border-[#E4B8B8] bg-[#FDECEC]"
                      : canEditAvailability
                        ? "border-[#FFE5B4] bg-[#FFF8ED]"
                        : "border-[#DCE3ED] bg-[#FBFCFE]"
                    }`}>
                    <div>
                      <h4 className={`text-sm font-semibold ${canEditAvailability && isBusyRangeValid
                          ? "text-[#9A3E3E]"
                          : canEditAvailability
                            ? "text-[#986A26]"
                            : "text-[#5A6C7D]"
                        }`}>
                        {canEditAvailability && isBusyRangeValid
                          ? "Review Busy Override"
                          : canEditAvailability
                            ? "Invalid Time Range"
                            : "Status Read-Only"}
                      </h4>
                      <p className={`mt-0.5 text-sm ${canEditAvailability && isBusyRangeValid
                          ? "text-[#B05555]"
                          : canEditAvailability
                            ? "text-[#B07B2D]"
                            : "text-[#6E8196]"
                        }`}>
                        {canEditAvailability && isBusyRangeValid
                          ? `You are about to mark the time between ${busyRange} as busy.`
                          : canEditAvailability
                            ? "Please ensure the start time is before the end time to proceed."
                            : "You do not have permission to edit busy status for this date."}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Conflict Handling Options */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#1F3A5F]">Conflict Handling Strategy</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setBusyAction("cancel")}
                      className={`relative flex flex-col items-center p-4 rounded-md border transition-all ${busyAction === "cancel"
                        ? "border-[#B05555] bg-[#FDECEC]"
                        : "border-[#DCE3ED] bg-white hover:border-[#E4B8B8] hover:bg-[#FFFBFB]"
                        }`}
                    >
                      <span className={`font-semibold text-sm text-center ${busyAction === "cancel" ? "text-[#9A3E3E]" : "text-[#5A6C7D]"}`}>Cancel All</span>
                      <span className={`text-xs text-center mt-1 ${busyAction === "cancel" ? "text-[#B05555]" : "text-[#9AAABC]"}`}>Cancel overlapping requests immediately</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBusyAction("reschedule")}
                      className={`relative flex flex-col items-center p-4 rounded-md border transition-all ${busyAction === "reschedule"
                        ? "border-[#1F3A5F] bg-[#F8FAFC]"
                        : "border-[#DCE3ED] bg-white hover:border-[#C8D3E0] hover:bg-[#F8FAFC]"
                        }`}
                    >
                      <span className={`font-semibold text-sm text-center ${busyAction === "reschedule" ? "text-[#1F3A5F]" : "text-[#5A6C7D]"}`}>Auto-Reschedule</span>
                      <span className={`text-xs text-center mt-1 ${busyAction === "reschedule" ? "text-[#2A4A75]" : "text-[#9AAABC]"}`}>Send requests to pick a new time</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBusyAction("manual")}
                      className={`relative flex flex-col items-center p-4 rounded-md border transition-all ${busyAction === "manual"
                        ? "border-[#1F3A5F] bg-[#F8FAFC]"
                        : "border-[#DCE3ED] bg-white hover:border-[#C8D3E0] hover:bg-[#F8FAFC]"
                        }`}
                    >
                      <span className={`font-semibold text-sm text-center ${busyAction === "manual" ? "text-[#1F3A5F]" : "text-[#5A6C7D]"}`}>Manual Triage</span>
                      <span className={`text-xs text-center mt-1 ${busyAction === "manual" ? "text-[#2A4A75]" : "text-[#9AAABC]"}`}>Review each conflict case by case</span>
                    </button>
                  </div>
                </section>

                {/* Submit Container */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    type="button"
                    className={`w-full sm:w-auto min-w-[200px] rounded-md px-6 py-2.5 text-sm font-semibold transition-colors ${canEditAvailability && isBusyRangeValid
                      ? "bg-[#B05555] text-white hover:bg-[#9A3E3E]"
                      : "bg-[#9AAABC] text-white cursor-not-allowed"
                      }`}
                    disabled={!canEditAvailability || !isBusyRangeValid}
                    onClick={() => { }}
                  >
                    Confirm Busy Status
                  </button>
                </div>
              </div>
            </article>
          )}
        </section>
      </section>
    </main >
  );
}
