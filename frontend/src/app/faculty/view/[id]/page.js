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
      <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D] bg-[#F4F7FB]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-semibold">Loading Details...</p>
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8 h-[calc(100vh-64px)] flex flex-col font-sans">
      
      <Link href="/faculty/list" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A6FA5] hover:text-[#1F3A5F] transition mb-4 w-fit">
          <ArrowLeft size={16} /> Back to Scheduler
      </Link>

      <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[750px]">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 border-b border-[#E8EEF5]">
            <div className="space-y-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wide mb-1 ${
                    appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    appointment.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                }`}>
                    {appointment.status === 'APPROVED' ? 'CONFIRMED' : appointment.status}
                </span>
                <h1 className="text-xl font-bold text-[#1F3A5F]">{appointment.purpose}</h1>
                <p className="text-[#5A6C7D] text-sm font-medium">Ref: #{appointment.id}</p>
            </div>
            
            <div className="bg-[#F4F7FB] border border-[#DCE3ED] rounded-lg p-3 min-w-[170px] text-center">
                <p className="text-[#1F3A5F] font-bold text-sm">{dateString}</p>
                <div className="h-px w-full bg-[#E8EEF5] my-2"></div>
                <p className="text-[#4A6FA5] font-semibold text-xs flex items-center justify-center gap-1.5">
                   <Clock size={14} /> {timeString}
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
            <div className="space-y-5">
                <div>
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-xs font-bold text-[#5A6C7D] uppercase tracking-wider flex items-center gap-1.5">
                           <User size={14} /> Participants ({appointment.students?.length}/{appointment.capacity})
                       </h3>
                    </div>
                    <div className="space-y-3">
                        {appointment.students?.map((participant) => {
                           const studentInfo = participant.student;
                           const isCreator = studentInfo.id === appointment.studentId;
                           return (
                               <div key={studentInfo.id} className="bg-[#F8FAFC] p-4 rounded-lg border border-[#DCE3ED] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                   <div>
                                       <p className="text-base font-bold text-[#1F3A5F] flex items-center">
                                          {studentInfo.user?.name}
                                          {isCreator && (
                                              <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Organizer</span>
                                          )}
                                       </p>
                                       <p className="text-[#5A6C7D] text-sm mt-0.5">{studentInfo.user?.email}</p>
                                   </div>
                                   <div className="flex flex-col sm:items-end gap-1 text-sm">
                                       <span className="font-medium text-[#4A6FA5]">
                                          Roll: {studentInfo.rollNumber}
                                       </span>
                                       <span className="text-[#5A6C7D]">
                                          {studentInfo.department}
                                       </span>
                                   </div>
                               </div>
                           );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-xs font-bold text-[#5A6C7D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <CalendarClock size={14} /> Timeslot Block
                        </h3>
                        <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#DCE3ED] flex items-center gap-3 h-[72px]">
                            <div className="h-8 w-8 bg-[#E8EEF5] rounded-full flex flex-shrink-0 items-center justify-center text-[#4A6FA5]">
                               <Clock size={16} />
                            </div>
                            <div>
                               <p className="text-[#1F3A5F] text-base font-bold">{duration} Minutes</p>
                               <p className="text-xs text-[#5A6C7D]">Reserved Window</p>
                            </div>
                        </div>
                    </div>
                    {appointment.isGroup && (
                        <div>
                            <h3 className="text-xs font-bold text-[#5A6C7D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <User size={14} /> Group Meeting Status
                            </h3>
                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 flex items-center gap-3 h-[72px]">
                                <div className="h-8 w-8 bg-white border border-rose-200 rounded-full flex flex-shrink-0 items-center justify-center text-rose-600">
                                   <User size={16} />
                                </div>
                                <div>
                                   <p className="text-rose-900 text-base font-bold">Group (Capacity: {appointment.capacity})</p>
                                   <p className="text-xs text-rose-700 font-semibold">isGroup: True</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {appointment.note && (
                    <div>
                        <h3 className="text-xs font-bold text-[#5A6C7D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MessageSquare size={14} /> Booking Note
                        </h3>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start h-[72px] overflow-y-auto">
                            <p className="text-amber-900 text-sm">
                               "{appointment.note}"
                            </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>

        <div className="bg-[#F8FAFC] p-5 border-t border-[#DCE3ED] flex-shrink-0">
             {appointment.status === 'PENDING' && (
                  <div className="flex flex-col gap-4 max-w-xl mx-auto">
                       <div className="flex flex-col gap-1.5">
                           <label className="text-sm font-semibold text-[#1F3A5F]">
                               Response Note <span className="text-xs text-[#5A6C7D] font-normal">(Optional)</span>
                           </label>
                           <textarea 
                               placeholder="Provide a reply reason..."
                               value={cancelNote}
                               onChange={(e) => setCancelNote(e.target.value)}
                               className="w-full text-sm rounded-md border border-[#DCE3ED] p-3 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] resize-none h-[60px]"
                           />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                          <button 
                             onClick={() => handleStatusUpdate('REJECTED')}
                             disabled={updating}
                             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white border border-[#DCE3ED] text-rose-600 hover:bg-rose-50 py-2.5 px-4 rounded-md text-sm font-semibold transition disabled:opacity-50"
                          >
                             <X size={16} /> Decline Request
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate('APPROVED')}
                            disabled={updating}
                            className="w-full sm:w-auto flex-[2] flex items-center justify-center gap-2 bg-[#4A6FA5] hover:bg-[#3f5e8a] text-white py-2.5 px-6 rounded-md text-sm font-semibold transition disabled:opacity-50"
                          >
                             <Check size={16} /> Approve
                          </button>
                      </div>
                  </div>
             )}

             {appointment.status === 'APPROVED' && (
                  <div className="flex flex-col gap-4 max-w-xl mx-auto">
                       <div className="flex flex-col gap-1.5">
                           <label className="text-sm font-semibold text-[#1F3A5F]">
                               Cancellation Reason <span className="text-xs text-[#5A6C7D] font-normal">(Optional)</span>
                           </label>
                           <textarea 
                               placeholder="Why are you cancelling?"
                               value={cancelNote}
                               onChange={(e) => setCancelNote(e.target.value)}
                               className="w-full text-sm rounded-md border border-[#DCE3ED] p-3 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] resize-none h-[60px]"
                           />
                       </div>
                       <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                           <button 
                             onClick={() => handleStatusUpdate('CANCELLED')}
                             disabled={updating}
                             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white border border-[#DCE3ED] text-rose-600 hover:bg-rose-50 py-2.5 px-4 rounded-md text-sm font-semibold transition disabled:opacity-50"
                          >
                             <CalendarOff size={16} /> Cancel Booking
                          </button>
                          <button 
                            onClick={handleReschedule}
                            disabled={updating}
                            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#1F3A5F] hover:bg-[#2A4A75] text-white py-2.5 px-6 rounded-md text-sm font-semibold transition disabled:opacity-50"
                          >
                             <Clock size={16} /> Request Reschedule
                          </button>
                      </div>
                  </div>
             )}

             {(appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') && (
                  <div className="text-center py-3 bg-white rounded-md border border-[#DCE3ED]">
                      <p className="text-[#5A6C7D] font-semibold text-sm">
                          Closed. No further action is required.
                      </p>
                  </div>
             )}
        </div>
      </div>
    </div>
  );
}
