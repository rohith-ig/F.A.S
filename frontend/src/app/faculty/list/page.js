"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../../axios";
import { Loader2, CalendarClock, Clock, Eye, Filter, User } from "lucide-react";
import Link from "next/link";

export default function FacultyAppointmentList() {
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/appmt');
      // sort by start date ascending
      setAppointments(response.data.sort((a, b) => new Date(a.start) - new Date(b.start)));
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const scheduledAppointments = appointments.filter(a => a.status === 'APPROVED');
  const historyAppointments = appointments.filter(a => ['REJECTED', 'CANCELLED'].includes(a.status) || new Date(a.end) < new Date());

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center text-[#5A6C7D] flex-col gap-3 bg-[#F4F7FB]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F3A5F]" />
          <p className="font-semibold">Loading Appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F4F7FB] py-8 font-sans">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        
        {/* Header Block */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F3A5F]">
              Faculty Scheduler
            </h1>
            <p className="text-[#5A6C7D] mt-1 text-sm md:text-base">
              Review requests and manage your scheduled appointments efficiently.
            </p>
          </div>
          
          <div className="hidden sm:block">
             <button className="inline-flex items-center gap-2 rounded-md border border-[#DCE3ED] bg-white px-4 py-2 text-sm font-medium text-[#1F3A5F] transition hover:bg-[#F4F7FB]">
                 <Filter size={16} /> Filter Output
             </button>
          </div>
        </header>

        {/* List Card Area */}
        <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm flex flex-col md:min-h-[600px] overflow-hidden">
        
          {/* Tabs */}
          <div className="flex bg-[#F8FAFC] border-b border-[#DCE3ED] overflow-x-auto">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "pending"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
              }`}
            >
              Pending Requests <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs select-none">{pendingAppointments.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("scheduled")}
              className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "scheduled"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
              }`}
            >
              Scheduled <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs select-none">{scheduledAppointments.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-3.5 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === "history"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-gray-50/50"
              }`}
            >
              History Log
            </button>
          </div>

          {/* List Scrolling Area */}
          <div className="flex-1 bg-white">
            {activeTab === "pending" && (
              pendingAppointments.length > 0 ? (
                <ul className="divide-y divide-[#DCE3ED]">
                  {pendingAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="pending" />
                  ))}
                </ul>
              ) : (
                <EmptyState text="No pending appointment requests to review." />
              )
            )}

            {activeTab === "scheduled" && (
              scheduledAppointments.length > 0 ? (
                <ul className="divide-y divide-[#DCE3ED]">
                  {scheduledAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="scheduled" />
                  ))}
                </ul>
              ) : (
                <EmptyState text="No upcoming scheduled appointments currently." />
              )
            )}

            {activeTab === "history" && (
              historyAppointments.length > 0 ? (
                 <ul className="divide-y divide-[#DCE3ED]">
                  {historyAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="history" />
                  ))}
                </ul>
              ) : (
                <EmptyState text="No past records or cancelled appointments found." />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentRow({ data, type }) {
  const startDate = new Date(data.start);
  const timeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const isPast = ['REJECTED', 'CANCELLED'].includes(data.status);
  const duration = (new Date(data.end) - new Date(data.start)) / 60000;

  return (
    <li className={`p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isPast ? 'opacity-80' : ''}`}>
      <div className="flex items-start gap-4">
          <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[70px] border border-[#4A6FA5]/20 flex-shrink-0">
              <span className="block text-xs font-bold text-[#4A6FA5] uppercase">{dateString.split(' ')[0]} {dateString.split(' ')[1].replace(',', '')}</span>
              <span className="block text-[15px] font-bold text-[#1F3A5F]">{timeString}</span>
          </div>
           <div>
              <h4 className="font-semibold text-[#1F3A5F] text-lg flex items-center gap-2">
                 {(() => {
                     const creator = data.students?.find(s => s.student?.id === data.studentId) || data.students?.[0];
                     return creator?.student?.user?.name || "Unknown Student";
                 })()}
                 <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Organizer</span>
                 
                 {data.students?.length > 1 && (
                    <span className="text-xs font-semibold bg-[#E8EEF5] text-[#4A6FA5] px-2 py-0.5 rounded-full">+ {data.students.length - 1} more</span>
                 )}
                 <span className="text-sm font-normal text-[#5A6C7D]">
                    ({(() => {
                        const creator = data.students?.find(s => s.student?.id === data.studentId) || data.students?.[0];
                        return creator?.student?.rollNumber || "N/A";
                    })()})
                 </span>
                 {data.capacity > 1 && (
                     <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 rounded">
                         Group
                     </span>
                 )}
              </h4>
              <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                  <Clock size={14} /> Duration: {duration} min
                  {data.capacity > 1 && (
                     <span className="ml-2 font-semibold text-[#4A6FA5] flex items-center gap-1">
                        <User size={12} /> {data.students?.length || 1}/{data.capacity}
                     </span>
                  )}
              </p>
              <p className="text-sm text-[#5A6C7D] mt-1 space-x-1 truncate max-w-full">
                 <span className="font-medium text-[#1F3A5F]">Purpose:</span> <span className="truncate max-w-[200px] sm:max-w-[400px] inline-block align-bottom">{data.purpose}</span>
              </p>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
         {type === "history" && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              data.status === 'REJECTED' || data.status === 'CANCELLED' 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {data.status === 'APPROVED' ? 'COMPLETED' : data.status}
            </span>
         )}
         
         <Link 
            href={`/faculty/view/${data.id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[#DCE3ED] text-[#1F3A5F] bg-white rounded-md hover:bg-[#F4F7FB] transition"
         >
             <Eye size={16} /> View
         </Link>
      </div>
    </li>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-[#5A6C7D]">
      <CalendarClock className="h-12 w-12 text-[#DCE3ED] mb-4" />
      <p className="text-lg font-medium text-[#1F3A5F]">{text}</p>
      <p className="text-sm mt-1">Check back later for updates</p>
    </div>
  );
}