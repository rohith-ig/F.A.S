"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, CalendarClock, Clock, User, Check, X, CalendarOff, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function FacultyAppointmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      const response = await api.get('/appmt');
      const found = response.data.find(a => String(a.id) === String(id));
      if (found) {
        setAppointment(found);
      } else {
         router.push('/faculty/list'); // Not found, redirect back
      }
    } catch (error) {
      console.error("Failed to fetch appointment:", error);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const payload = { status };
      if ((status === 'CANCELLED' || status === 'REJECTED') && cancelNote.trim() !== '') {
          payload.cancel = cancelNote;
      }
      await api.post(`/appmt/update/${id}`, payload);
      await fetchAppointmentDetails(); // refresh specific appointment locally
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleReschedule = () => {
    alert(`Reschedule request feature coming soon.`);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Appointment Details...</p>
      </div>
    );
  }

  if (!appointment) return null;

  const startDate = new Date(appointment.start);
  const endDate = new Date(appointment.end);
  const dateString = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeString = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const duration = (endDate - startDate) / 60000;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 h-[calc(100vh-64px)] overflow-hidden flex flex-col justify-center">
      
      <Link href="/faculty/list" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A6FA5] hover:text-[#1F3A5F] transition mb-3">
          <ArrowLeft size={16} /> Back to Appointments
      </Link>

      <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[750px]">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 border-b border-[#E8EEF5]">
            <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm border ${
                    appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    appointment.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    'bg-rose-100 text-rose-700 border-rose-200'
                }`}>
                    {appointment.status === 'APPROVED' ? 'CONFIRMED' : appointment.status}
                </span>
                <h1 className="text-xl font-bold text-[#1F3A5F] leading-tight">{appointment.purpose}</h1>
                <p className="text-[#5A6C7D] mt-1 text-xs font-medium">Ref ID: #{appointment.id}</p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-[#DCE3ED] rounded-lg p-3 min-w-[160px] text-center shadow-sm">
                <p className="text-[#1F3A5F] font-bold text-sm">{dateString}</p>
                <div className="h-px w-full bg-[#E8EEF5] my-1.5"></div>
                <p className="text-[#4A6FA5] font-bold text-xs flex items-center justify-center gap-1.5">
                   <Clock size={12} /> {timeString}
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
            <div className="space-y-4">
                <div>
                    <h3 className="text-[10px] font-bold text-[#6C8096] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={14} /> Student Information
                    </h3>
                    <div className="bg-[#FBFCFE] p-3.5 rounded-lg border border-[#E8EEF5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <p className="text-base font-bold text-[#1F3A5F]">{appointment.student.user.name}</p>
                            <p className="text-[#5A6C7D] text-xs font-medium mt-0.5">{appointment.student.user.email}</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:text-right">
                            <span className="text-xs font-bold text-[#4A6FA5] bg-[#F0F4F8] px-2 py-0.5 rounded inline-block">
                               Roll: {appointment.student.rollNumber}
                            </span>
                            <span className="text-[10px] font-semibold text-[#5A6C7D]">
                               Dept: {appointment.student.department}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-[#6C8096] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CalendarClock size={14} /> Duration Setup
                        </h3>
                        <div className="bg-[#FBFCFE] p-3 rounded-lg border border-[#E8EEF5] flex items-center gap-3 h-[58px]">
                            <div className="h-8 w-8 bg-[#E8EEF5] rounded gap-2 flex flex-shrink-0 items-center justify-center text-[#4A6FA5]">
                               <Clock size={16} />
                            </div>
                            <div>
                               <p className="text-[#1F3A5F] text-sm font-bold">{duration} Minutes</p>
                               <p className="text-[10px] text-[#5A6C7D] font-medium">Reserved Time Window</p>
                            </div>
                        </div>
                    </div>
                    {appointment.note && (
                    <div>
                        <h3 className="text-[10px] font-bold text-[#6C8096] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MessageSquare size={14} /> Attached Note
                        </h3>
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start h-[58px] overflow-y-auto">
                            <p className="text-amber-900 font-medium text-xs leading-snug">
                               "{appointment.note}"
                            </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>

        <div className="bg-[#F4F7FB] p-4 border-t border-[#E8EEF5] flex-shrink-0">
             {appointment.status === 'PENDING' && (
                  <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-[#1F3A5F] flex items-center gap-1.5">
                               Response Note <span className="text-[10px] text-[#5A6C7D] font-normal">(Optional for Decline)</span>
                           </label>
                           <textarea 
                               placeholder="Add a note (e.g. why you are declining)..."
                               value={cancelNote}
                               onChange={(e) => setCancelNote(e.target.value)}
                               className="w-full text-xs rounded-lg border border-[#DCE3ED] p-2.5 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] shadow-sm transition resize-none h-[50px]"
                           />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-3">
                          <button 
                             onClick={() => handleStatusUpdate('REJECTED')}
                             disabled={updating}
                             className="w-full sm:w-1/3 flex items-center justify-center gap-1.5 bg-white border border-rose-500 text-rose-600 hover:bg-rose-50 py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-50"
                          >
                             <X size={16} /> Decline
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate('APPROVED')}
                            disabled={updating}
                            className="w-full sm:w-2/3 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-50 shadow-sm"
                          >
                             <Check size={16} /> Approve Request
                          </button>
                      </div>
                  </div>
             )}

             {appointment.status === 'APPROVED' && (
                  <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-[#1F3A5F] flex items-center gap-1.5">
                               Cancellation Note <span className="text-[10px] text-[#5A6C7D] font-normal">(Optional)</span>
                           </label>
                           <textarea 
                               placeholder="Reason for cancelling..."
                               value={cancelNote}
                               onChange={(e) => setCancelNote(e.target.value)}
                               className="w-full text-xs rounded-lg border border-[#DCE3ED] p-2.5 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] shadow-sm transition resize-none h-[50px]"
                           />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-3">
                           <button 
                             onClick={() => handleStatusUpdate('CANCELLED')}
                             disabled={updating}
                             className="w-full sm:flex-1 flex items-center justify-center gap-1.5 bg-white border border-[#DCE3ED] text-rose-600 hover:bg-rose-50 hover:border-rose-200 py-2.5 rounded-lg text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             <CalendarOff size={16} /> Cancel
                          </button>
                          <button 
                            onClick={handleReschedule}
                            disabled={updating}
                            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 bg-[#1F3A5F] hover:bg-[#2A4A75] text-white py-2.5 rounded-lg text-sm font-bold transition shadow-sm disabled:opacity-50"
                          >
                             <Clock size={16} /> Reschedule
                          </button>
                      </div>
                  </div>
             )}

             {(appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') && (
                  <div className="text-center py-2 bg-white rounded-lg border border-[#DCE3ED] shadow-sm">
                      <p className="text-[#5A6C7D] font-bold text-xs">
                          Closed. No further action is required.
                      </p>
                  </div>
             )}
        </div>
      </div>
    </div>
  );
}
