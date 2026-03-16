"use client";

import { useState } from "react";
import {
  pendingRequestsData,
  scheduledRequestsData,
  historyRequestsData,
} from "./requestData";

export default function FacultyAppointmentsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const [pendingAppointments, setPendingAppointments] =
    useState(pendingRequestsData);

  const [scheduledAppointments, setScheduledAppointments] =
    useState(scheduledRequestsData);

  const [historyAppointments] = useState(historyRequestsData);

  const handleApprove = (appointment) => {
    setPendingAppointments((prev) =>
      prev.filter((appt) => appt.id !== appointment.id)
    );

    setScheduledAppointments((prev) => [...prev, appointment]);
  };

  const handleReject = (appointment) => {
    setPendingAppointments((prev) =>
      prev.filter((appt) => appt.id !== appointment.id)
    );
  };

  const handleCancel = (appointment) => {
    setScheduledAppointments((prev) =>
      prev.filter((appt) => appt.id !== appointment.id)
    );
  };

  const handleReschedule = (appointment) => {
    alert(
      `Reschedule request sent to ${appointment.student}. Student will receive a notification to select a new slot.`
    );

    setScheduledAppointments((prev) =>
      prev.filter((appt) => appt.id !== appointment.id)
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4">
      <section className="mx-auto w-full max-w-5xl">

        {/* Page Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F3A5F]">
            Manage Appointments
          </h1>

          <p className="text-sm text-[#5A6C7D] mt-1">
            Review pending requests and manage your upcoming meetings.
          </p>
        </div>

        {/* Tabs */}

        <div className="flex border-b border-[#DCE3ED] mb-6">

          <Tab
            label="Pending"
            value="pending"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <Tab
            label="Scheduled"
            value="scheduled"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <Tab
            label="History"
            value="history"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>

        <section className="space-y-4">

          {/* Pending */}

          {activeTab === "pending" &&
            (pendingAppointments.length ? (
              pendingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  data={appt}
                  showApproveReject
                  onApprove={() => handleApprove(appt)}
                  onReject={() => handleReject(appt)}
                />
              ))
            ) : (
              <EmptyState text="No pending appointment requests." />
            ))}

          {/* Scheduled */}

          {activeTab === "scheduled" &&
            (scheduledAppointments.length ? (
              scheduledAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  data={appt}
                  showReschedule
                  onReschedule={() => handleReschedule(appt)}
                  onCancel={() => handleCancel(appt)}
                />
              ))
            ) : (
              <EmptyState text="No scheduled appointments." />
            ))}

          {/* History */}

          {activeTab === "history" &&
            (historyAppointments.length ? (
              historyAppointments.map((appt) => (
                <AppointmentCard key={appt.id} data={appt} />
              ))
            ) : (
              <EmptyState text="No past appointments." />
            ))}

        </section>
      </section>
    </main>
  );
}

function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium transition ${
        activeTab === value
          ? "text-[#1F3A5F] border-b-2 border-[#1F3A5F]"
          : "text-[#5A6C7D]"
      }`}
    >
      {label}
    </button>
  );
}

function AppointmentCard({
  data,
  showApproveReject,
  showReschedule,
  onApprove,
  onReject,
  onReschedule,
  onCancel,
}) {
  return (
    <article className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-base font-semibold text-[#1F3A5F]">
            {data.student}
          </h3>

          <p className="text-sm text-[#4A6FA5]">{data.topic}</p>

          <p className="text-xs text-[#5A6C7D] mt-1">
            {data.date} • {data.time}
          </p>
        </div>

        <span className="text-xs px-2 py-1 rounded-full bg-[#4A6FA5]/10 text-[#2A4A75]">
          {data.mode}
        </span>

      </div>

      {/* Pending Buttons */}

      {showApproveReject && (
        <div className="mt-4 flex gap-2">

          <button
            onClick={onApprove}
            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md"
          >
            Approve
          </button>

          <button
            onClick={onReject}
            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md"
          >
            Reject
          </button>

        </div>
      )}

      {/* Scheduled Buttons */}

      {showReschedule && (
        <div className="mt-4 flex gap-2">

          <button
            onClick={onReschedule}
            className="px-3 py-1.5 text-xs bg-[#1F3A5F] text-white rounded-md"
          >
            Reschedule
          </button>

          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md"
          >
            Cancel
          </button>

        </div>
      )}

    </article>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-lg border border-[#DCE3ED] bg-white p-6 text-center text-sm text-[#5A6C7D] shadow-sm">
      {text}
    </div>
  );
}