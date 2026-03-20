"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../../../axios";
import { Loader2, CalendarClock, Clock, Eye } from "lucide-react";
import Link from "next/link";

export default function FacultyAppointmentList() {
  const [activeTab, setActiveTab] = useState("pending");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/appmt');
      // sort by start date ascending, or creation date
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
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Appointments...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-64px)] w-full flex bg-[#F7F9FC] overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-[#4A6FA5]/20 rounded-full blur-3xl pointer-events-none opacity-50" />
      <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-[#2A4A75]/20 rounded-full blur-3xl pointer-events-none opacity-50" />

      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col z-10 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 shrink-0 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-10 h-10 flex items-center justify-center bg-[#4A6FA5] text-white font-bold rounded-lg text-sm shadow-sm">
                FS
              </div>
              <h1 className="text-2xl font-bold text-[#1F3A5F]">Faculty Scheduler</h1>
            </div>
            <p className="text-[#5A6C7D] text-sm mt-1">
              Review requests and manage your scheduled appointments efficiently.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        
          {/* Tabs */}
          <div className="flex bg-[#F8FAFC] border-b border-[#DCE3ED] shrink-0 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "pending"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-white/60"
              }`}
            >
              Pending Requests <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs shadow-sm">{pendingAppointments.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("scheduled")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === "scheduled"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-white/60"
              }`}
            >
              Scheduled <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs shadow-sm">{scheduledAppointments.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === "history"
                  ? "text-[#1F3A5F] border-[#1F3A5F] bg-white"
                  : "text-[#5A6C7D] border-transparent hover:text-[#1F3A5F] hover:bg-white/60"
              }`}
            >
              History Log
            </button>
          </div>

          {/* Content Scroll Layer */}
          <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
            {activeTab === "pending" && (
              pendingAppointments.length > 0 ? (
                <ul className="divide-y divide-[#E8EEF5]">
                  {pendingAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="pending"  />
                  ))}
                </ul>
              ) : (
                <EmptyState text="No pending appointment requests to review." />
              )
            )}

            {activeTab === "scheduled" && (
              scheduledAppointments.length > 0 ? (
                <ul className="divide-y divide-[#E8EEF5]">
                  {scheduledAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} data={appt} type="scheduled"  />
                  ))}
                </ul>
              ) : (
                <EmptyState text="No upcoming scheduled appointments currently." />
              )
            )}

            {activeTab === "history" && (
              historyAppointments.length > 0 ? (
                 <ul className="divide-y divide-[#E8EEF5]">
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

  return (
    <li className={`p-4 hover:bg-[#F4F7FB] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isPast ? 'opacity-80' : ''}`}>
      <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="bg-[#4A6FA5]/10 rounded-lg p-2.5 text-center min-w-[65px] border border-[#4A6FA5]/20 flex-shrink-0">
              <span className="block text-[10px] font-bold text-[#4A6FA5] uppercase">{dateString.split(' ')[0]} {dateString.split(' ')[1].replace(',', '')}</span>
              <span className="block text-sm font-bold text-[#1F3A5F]">{timeString}</span>
          </div>
          <div className="min-w-0">
              <h4 className="font-bold text-[#1F3A5F] text-base truncate flex items-center gap-2">
                 {data.student.user.name} 
                 <span className="text-[11px] font-bold text-[#4A6FA5] bg-[#E8EEF5] px-2 py-0.5 rounded">
                    {data.student.rollNumber}
                 </span>
              </h4>
              <p className="text-xs text-[#5A6C7D] flex items-center gap-1.5 mt-1 font-medium">
                  <Clock size={12} className="text-[#4A6FA5]" /> Duration: {(new Date(data.end) - new Date(data.start)) / 60000} min
              </p>
              <p className="text-sm text-[#3E5266] mt-1.5 truncate max-w-full">
                 <span className="font-bold text-[#6C8096] text-[11px] uppercase tracking-wider mr-1">Purpose:</span> 
                 {data.purpose}
              </p>
          </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
         {type === "history" && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${
              data.status === 'REJECTED' || data.status === 'CANCELLED' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {data.status === 'APPROVED' ? 'COMPLETED' : data.status}
            </span>
         )}
         
         <Link 
            href={`/faculty/view/${data.id}`}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold border-2 border-[#DCE3ED] text-[#1F3A5F] bg-white rounded-lg hover:border-[#4A6FA5] hover:bg-[#F4F7FB] hover:text-[#4A6FA5] transition shadow-sm w-full sm:w-auto"
         >
             <Eye size={14} /> View Details
         </Link>
      </div>
    </li>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#5A6C7D] h-full">
      <div className="bg-[#E8EEF5] p-4 rounded-full mb-4">
         <CalendarClock className="h-8 w-8 text-[#4A6FA5]" />
      </div>
      <p className="font-semibold text-[#1F3A5F]">{text}</p>
      <p className="text-xs mt-1">Check back later for updates.</p>
    </div>
  );
}