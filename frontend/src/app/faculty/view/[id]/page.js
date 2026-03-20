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
      if (status === 'CANCELLED' && cancelNote.trim() !== '') {
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
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      
      <Link href="/faculty/list" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A6FA5] hover:text-[#1F3A5F] transition mb-6">
          <ArrowLeft size={16} /> Back to Appointments
      </Link>

      <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#E8EEF5] pb-6">
            <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm border ${
                    appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    appointment.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    'bg-rose-100 text-rose-700 border-rose-200'
                }`}>
                    {appointment.status === 'APPROVED' ? 'CONFIRMED' : appointment.status}
                </span>
                <h1 className="text-3xl font-bold text-[#1F3A5F] leading-tight">{appointment.purpose}</h1>
                <p className="text-[#5A6C7D] mt-2 font-medium">Ref ID: #{appointment.id}</p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-[#DCE3ED] rounded-xl p-5 min-w-[220px] text-center shadow-sm">
                <p className="text-[#1F3A5F] font-bold text-lg">{dateString}</p>
                <div className="h-px w-full bg-[#E8EEF5] my-3"></div>
                <p className="text-[#4A6FA5] font-bold flex items-center justify-center gap-2">
                   <Clock size={16} /> {timeString}
                </p>
            </div>
        </div>

        <div className="space-y-6 mb-10">
            <div>
                <h3 className="text-xs font-bold text-[#6C8096] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User size={16} /> Student Information
                </h3>
                <div className="bg-[#FBFCFE] p-5 rounded-xl border border-[#E8EEF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xl font-bold text-[#1F3A5F]">{appointment.student.user.name}</p>
                        <p className="text-[#5A6C7D] font-medium mt-1">{appointment.student.user.email}</p>
                    </div>
                    <div className="flex flex-col gap-1 sm:text-right">
                        <span className="text-sm font-bold text-[#4A6FA5] bg-[#F0F4F8] px-3 py-1 rounded-md inline-block">
                           Roll: {appointment.student.rollNumber}
                        </span>
                        <span className="text-sm font-semibold text-[#5A6C7D]">
                           Dept: {appointment.student.department}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xs font-bold text-[#6C8096] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CalendarClock size={16} /> Duration Setup
                    </h3>
                    <div className="bg-[#FBFCFE] p-4 rounded-xl border border-[#E8EEF5] flex items-center gap-3 h-[72px]">
                        <div className="h-10 w-10 bg-[#E8EEF5] rounded-lg flex flex-shrink-0 items-center justify-center text-[#4A6FA5]">
                           <Clock size={20} />
                        </div>
                        <div>
                           <p className="text-[#1F3A5F] font-bold">{duration} Minutes</p>
                           <p className="text-xs text-[#5A6C7D] font-medium">Reserved Time Window</p>
                        </div>
                    </div>
                </div>
                {appointment.note && (
                <div>
                    <h3 className="text-xs font-bold text-[#6C8096] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare size={16} /> Attached Note
                    </h3>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 h-[72px] overflow-y-auto">
                        <p className="text-amber-900 font-medium text-sm leading-snug">
                           "{appointment.note}"
                        </p>
                    </div>
                </div>
                )}
            </div>
        </div>

        <div className="bg-[#F4F7FB] p-5 md:p-6 rounded-2xl border border-[#DCE3ED]">
             {appointment.status === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button 
                         onClick={() => handleStatusUpdate('REJECTED')}
                         disabled={updating}
                         className="w-full sm:w-1/3 flex items-center justify-center gap-2 bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 hover:border-rose-600 py-3.5 rounded-xl font-bold transition disabled:opacity-50"
                      >
                         <X size={20} /> Decline
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate('APPROVED')}
                        disabled={updating}
                        className="w-full sm:w-2/3 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition disabled:opacity-50 shadow-sm"
                      >
                         <Check size={20} /> Approve Request
                      </button>
                  </div>
             )}

             {appointment.status === 'APPROVED' && (
                  <div className="flex flex-col gap-5">
                       <div className="flex flex-col gap-2">
                           <label className="text-sm font-bold text-[#1F3A5F] flex items-center gap-2">
                               Cancellation Note <span className="text-xs text-[#5A6C7D] font-normal">(Required for cancellations)</span>
                           </label>
                           <textarea 
                               placeholder="Please provide a brief reason for cancelling this appointment..."
                               value={cancelNote}
                               onChange={(e) => setCancelNote(e.target.value)}
                               className="w-full text-sm rounded-xl border border-[#DCE3ED] p-4 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] shadow-sm transition resize-none min-h-[90px]"
                           />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-4">
                           <button 
                             onClick={() => handleStatusUpdate('CANCELLED')}
                             disabled={updating || cancelNote.trim() === ''}
                             className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-white border border-[#DCE3ED] text-rose-600 hover:bg-rose-50 hover:border-rose-200 py-3.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                             <CalendarOff size={18} /> Confirm Cancellation
                          </button>
                          <button 
                            onClick={handleReschedule}
                            disabled={updating}
                            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#1F3A5F] hover:bg-[#2A4A75] text-white py-3.5 rounded-xl font-bold transition shadow-sm disabled:opacity-50"
                          >
                             <Clock size={18} /> Propose Reschedule
                          </button>
                      </div>
                  </div>
             )}

             {(appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') && (
                  <div className="text-center py-4 bg-white rounded-xl border border-[#DCE3ED] shadow-sm">
                      <p className="text-[#5A6C7D] font-bold text-sm">
                          This appointment request has been closed. <br className="sm:hidden" />
                          <span className="font-medium">No further action is required.</span>
                      </p>
                  </div>
             )}
        </div>
      </div>
    </div>
  );
}
