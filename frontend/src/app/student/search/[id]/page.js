"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, Calendar, Clock, CheckCircle2, User, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [availabilities, setAvailabilities] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(30);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avail?facultyId=${id}`);
      setAvailabilities(response.data);
      if (response.data.length > 0) {
         setFaculty(response.data[0].faculty);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const maxDur = (new Date(slot.end) - new Date(slot.start)) / 60000;
    setDuration(Math.min(30, maxDur));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !purpose) {
        alert("Please select a time slot and state your purpose.");
        return;
    }
    setSubmitting(true);
    try {
        const fullNote = `${note}${isGroupMeeting ? ' [Group Meeting]' : ''}${isRecurringMeeting ? ' [Recurring Meeting]' : ''}`.trim();
        const payload = {
            facultyId: parseInt(id),
            start: selectedSlot.start,
            duration: parseInt(duration),
            purpose,
            note: fullNote || undefined
        };
        await api.post('/appmt', payload);
        setSuccess(true);
        setTimeout(() => {
            router.push('/student');
        }, 2000);
    } catch (error) {
         console.error("Booking error:", error);
         alert(error.response?.data?.error || "Failed to book appointment");
    } finally {
         setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Faculty Availability...</p>
      </div>
    );
  }

  if (availabilities.length === 0) {
      return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8 text-center text-[#5A6C7D]">
            <Calendar className="mx-auto h-16 w-16 text-[#DCE3ED] mb-4" />
            <p className="text-lg font-semibold">No Available Slots</p>
            <p className="text-sm">This faculty member does not have any free availability slots right now.</p>
            <Link href="/student/search" className="mt-4 inline-block text-[#4A6FA5] font-medium hover:underline">
               Back to Search
            </Link>
        </div>
      );
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 py-4 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* Aesthetic Background Splashes */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-52 h-52 bg-[#1F3A5F]/5 rounded-full blur-2xl -z-10" />

      <div className="mb-3">
          <Link href="/student/search" className="inline-flex items-center gap-1 text-xs font-bold text-[#4A6FA5] hover:text-[#1F3A5F] transition">
              <ArrowLeft size={14} /> Back to Search
          </Link>
      </div>

      {success ? (
         <div className="flex-1 flex items-center justify-center">
             <div className="bg-white border border-emerald-100 rounded-2xl p-6 text-center shadow-md animate-fade-in max-w-sm backdrop-blur-md bg-white/80">
                 <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
                 <h2 className="text-xl font-bold text-[#1F3A5F] mb-1">Booking Request Sent!</h2>
                 <p className="text-sm text-[#5A6C7D] mb-3">Your request has been submitted and is awaiting approval.</p>
                 <p className="text-[10px] text-gray-400">Redirecting to Dashboard...</p>
             </div>
         </div>
      ) : (
         <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
             
             {/* Left Panel - Faculty & Slots */}
             <div className="md:col-span-7 flex flex-col overflow-hidden bg-white/90 backdrop-blur-md border border-[#DCE3ED] rounded-xl shadow-sm p-4">
                 <header className="mb-3 flex items-start gap-3 border-b border-[#E8EEF5] pb-3">
                     <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1F3A5F] to-[#2A4A75] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                         <User size={20} />
                     </div>
                     <div className="min-w-0">
                         <p className="text-[10px] font-bold text-[#4A6FA5] tracking-wider uppercase truncate">{faculty?.designation || 'Faculty'}</p>
                         <h1 className="text-lg font-bold text-[#1F3A5F] mt-0.5 truncate">{faculty?.user?.name}</h1>
                         <p className="text-xs text-[#5A6C7D] truncate">{faculty?.department}</p>
                     </div>
                 </header>

                 <div className="flex-1 overflow-hidden flex flex-col">
                     <label className="block text-xs font-bold text-[#1F3A5F] mb-2 flex items-center gap-1.5">
                         <Calendar size={14} className="text-[#4A6FA5]" /> Select a time slot
                     </label>
                     <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start">
                          {availabilities.map((slot, index) => {
                              const start = new Date(slot.start);
                              const end = new Date(slot.end);
                              const isSelected = selectedSlot === slot;
                              
                              return (
                                  <button
                                      type="button"
                                      key={index}
                                      onClick={() => handleSlotSelect(slot)}
                                      className={`p-2.5 border rounded-xl text-left transition-all duration-150 flex flex-col justify-between h-20 ${
                                          isSelected 
                                          ? 'border-[#1F3A5F] bg-[#1F3A5F]/5 ring-2 ring-[#1F3A5F] shadow-sm scale-[1.01]' 
                                          : 'border-[#DCE3ED] bg-[#FBFCFE]/80 hover:border-[#1F3A5F]/40 hover:bg-white'
                                      }`}
                                  >
                                      <div>
                                          <p className="text-xs font-bold text-[#1F3A5F]">
                                              {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric',   year: 'numeric'  })}
                                          </p>
                                          <p className="text-[11px] font-semibold text-[#4A6FA5] mt-0.5 flex items-center gap-1">
                                              <Clock size={11} /> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                      </div>
                                      <div className="text-right w-full">
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-[#1F3A5F] text-white' : 'bg-gray-100 text-[#5A6C7D]'}`}>
                                              {(end - start) / 60000}m max
                                          </span>
                                      </div>
                                  </button>
                              );
                          })}
                     </div>
                 </div>
             </div>

             {/* Right Panel - Form Details */}
             <div className="md:col-span-5 flex flex-col overflow-hidden bg-white/90 backdrop-blur-md border border-[#DCE3ED] rounded-xl shadow-sm p-4">
                 <div className="border-b border-[#E8EEF5] pb-2 mb-3 flex items-center gap-1.5">
                     <BookOpen size={18} className="text-[#1F3A5F]" />
                     <h2 className="text-sm font-bold text-[#1F3A5F]">Request Details</h2>
                 </div>

                 <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4 pr-1">
                     <div className="space-y-4">
                         <div>
                             <label className="block text-xs font-bold text-[#1F3A5F] mb-1.5">Purpose of Meeting</label>
                             <input 
                                 type="text"
                                 required
                                 value={purpose}
                                 onChange={(e) => setPurpose(e.target.value)}
                                 placeholder="e.g., Project Review, Doubts"
                                 className="w-full rounded-lg border border-[#DCE3ED] px-3.5 py-2 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] focus:ring-1 focus:border-[#1F3A5F] transition"
                             />
                         </div>

                         {selectedSlot && (
                             <div>
                                 <label className="block text-xs font-bold text-[#1F3A5F] mb-1.5">Duration (Minutes)</label>
                                 <div className="flex items-center gap-2">
                                     <input 
                                         type="number"
                                         required
                                         value={duration}
                                         min={5}
                                         max={(new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000}
                                         onChange={(e) => setDuration(Math.min(e.target.value, (new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000))}
                                         className="w-24 rounded-lg border border-[#DCE3ED] px-3 py-1.5 text-sm text-[#1F3A5F] font-bold outline-none text-center"
                                     />
                                     <span className="text-xs text-[#5A6C7D]">
                                         Range: 5 to {(new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000} mins
                                     </span>
                                 </div>
                             </div>
                         )}

                         <div>
                             <label className="block text-xs font-bold text-[#1F3A5F] mb-1.5">Meeting Options</label>
                             <div className="grid grid-cols-2 gap-2 text-xs">
                                 <label className={`flex items-center justify-center gap-1.5 p-2 border rounded-xl font-semibold cursor-pointer transition ${isGroupMeeting ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]' : 'bg-[#FBFCFE] text-[#4A6FA5] border-[#DCE3ED] hover:bg-gray-50'}`}>
                                     <input 
                                         type="checkbox" 
                                         checked={isGroupMeeting} 
                                         onChange={(e) => setIsGroupMeeting(e.target.checked)} 
                                         className="sr-only"
                                     />
                                     Group Meet
                                 </label>
                                 <label className={`flex items-center justify-center gap-1.5 p-2 border rounded-xl font-semibold cursor-pointer transition ${isRecurringMeeting ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]' : 'bg-[#FBFCFE] text-[#4A6FA5] border-[#DCE3ED] hover:bg-gray-50'}`}>
                                     <input 
                                         type="checkbox" 
                                         checked={isRecurringMeeting} 
                                         onChange={(e) => setIsRecurringMeeting(e.target.checked)} 
                                         className="sr-only"
                                     />
                                     Recurring
                                 </label>
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-[#1F3A5F] mb-1.5">Note (Optional)</label>
                             <textarea 
                                 value={note}
                                 onChange={(e) => setNote(e.target.value)}
                                 placeholder="Context or brief description..."
                                 className="w-full min-h-[80px] text-xs rounded-lg border border-[#DCE3ED] px-3 py-2 text-[#1F3A5F] outline-none focus:border-[#1F3A5F] resize-none"
                             />
                         </div>
                     </div>

                     <button
                         type="submit"
                         disabled={submitting || !selectedSlot}
                         className="w-full py-2.5 mt-2 rounded-xl bg-[#1F3A5F] text-white font-bold text-sm shadow-md hover:bg-[#2A4A75] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                         {submitting ? "Booking..." : "Request Appointment"}
                     </button>
                 </form>
             </div>

         </div>
      )}

    </div>
  );
}
