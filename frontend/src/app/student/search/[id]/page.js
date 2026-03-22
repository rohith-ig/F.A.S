"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, Calendar, Clock, CheckCircle2, User, BookOpen, Clock3, MessageSquare } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function BookAppointmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [availabilities, setAvailabilities] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(10);
  const [purpose, setPurpose] = useState("");
  const [note, setNote] = useState("");
  const [isGroupMeeting, setIsGroupMeeting] = useState(false);
  const [capacity, setCapacity] = useState(1);
  const [isRecurringMeeting, setIsRecurringMeeting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/avail?facultyId=${id}`);
      
      const filteredAndSortedSlots = response.data
        .filter(slot => {
            const maxDur = (new Date(slot.end) - new Date(slot.start)) / 60000;
            return maxDur >= 10;
        })
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      setAvailabilities(filteredAndSortedSlots);
      if (filteredAndSortedSlots.length > 0) {
         setFaculty(filteredAndSortedSlots[0].faculty);
      }
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Failed to fetch slots. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    const startObj = new Date(slot.start);
    setStartTime(`${String(startObj.getHours()).padStart(2, '0')}:${String(startObj.getMinutes()).padStart(2, '0')}`);
    const maxDur = (new Date(slot.end) - startObj) / 60000;
    setDuration(Math.max(10, Math.min(30, maxDur)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !purpose) {
        toast.error("Please select a time slot and state your purpose.");
        return;
    }
    setSubmitting(true);
    try {
        const fullNote = note.trim();
        const startFull = new Date(selectedSlot.start);
        const [h, m] = startTime.split(':').map(Number);
        startFull.setHours(h, m, 0, 0);

        const payload = {
            facultyId: parseInt(id),
            start: startFull.toISOString(),
            duration: parseInt(duration),
            purpose,
            note: fullNote || undefined,
            capacity: parseInt(capacity),
            isGroup: isGroupMeeting
        };
        await api.post('/appmt', payload);
        setSuccess(true);
        toast.success("Appointment request sent!");
        setTimeout(() => {
            router.push('/student');
        }, 2000);
    } catch (error) {
         console.error("Booking error:", error);
         toast.error(error.response?.data?.error || "Failed to book appointment. Please try again.");
    } finally {
         setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center gap-4 text-[#5A6C7D] bg-[#F4F7FB]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-base font-semibold">Loading Faculty Details...</p>
      </div>
    );
  }

  if (availabilities.length === 0) {
      return (
        <div className="mx-auto w-full h-[calc(100vh-64px)] px-6 py-12 text-center text-[#5A6C7D] bg-[#F4F7FB] flex flex-col items-center justify-center">
            <Calendar className="mx-auto h-16 w-16 text-[#DCE3ED] mb-4" />
            <p className="text-2xl font-bold text-[#1F3A5F]">No Available Slots</p>
            <p className="text-sm mt-2">This faculty member does not have any free availability slots of 10 minutes or more right now.</p>
            <Link href="/student/search" className="mt-6 inline-block px-6 py-2.5 bg-[#1F3A5F] text-white text-sm font-medium rounded-lg hover:bg-[#2B4E7A] transition shadow-sm">
               Back to Search
            </Link>
        </div>
      );
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#F4F7FB] flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Outer wrapper restricted height and width */}
      <div className="w-full max-w-5xl h-full max-h-[580px] bg-white border border-[#DCE3ED] shadow-sm rounded-lg overflow-hidden flex flex-col">
        
        {/* Header / Top Bar within Card */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EEF5] bg-[#FBFCFE]">
          <div className="flex items-center gap-4">
            <Link href="/student/search" className="p-2 -ml-2 text-[#4A6FA5] hover:text-[#1F3A5F] hover:bg-[#F0F4F8] rounded-md transition">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#F0F4F8] flex items-center justify-center text-[#1F3A5F]">
                  <User size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1F3A5F] leading-tight">{faculty?.user?.name || "Faculty Member"}</h1>
                <p className="text-xs font-semibold text-[#5A6C7D] flex items-center gap-2">
                  <span className="uppercase tracking-wider text-[#4A6FA5]">{faculty?.designation}</span> 
                  <span>•</span> 
                  <span>{faculty?.department}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Split View */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel - Timeline / Slots */}
          <div className="w-1/2 border-r border-[#E8EEF5] flex flex-col bg-white">
            <div className="px-6 py-3 border-b border-[#E8EEF5]">
              <h2 className="text-base font-bold text-[#1F3A5F] flex items-center gap-2">
                <Calendar size={18} className="text-[#4A6FA5]" /> Available Time Slots
              </h2>
              <p className="text-xs text-[#5A6C7D] mt-1">Select a slot to request an appointment. (Min 10 mins)</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {availabilities.map((slot, index) => {
                    const start = new Date(slot.start);
                    const end = new Date(slot.end);
                    const isSelected = selectedSlot === slot;
                    const maxMins = (end - start) / 60000;
                    
                    return (
                        <button
                            type="button"
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className={`p-3 border rounded-lg text-left transition-all flex flex-col justify-between h-[82px] ${
                                isSelected 
                                ? 'border-[#4A6FA5] bg-[#4A6FA5] text-white shadow-md' 
                                : 'border-[#DCE3ED] bg-white hover:border-[#4A6FA5]/60 hover:shadow-sm text-[#1F3A5F]'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#1F3A5F]'}`}>
                                    {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F4F8] text-[#5A6C7D]'}`}>
                                    {maxMins}m max
                                </span>
                            </div>
                            <p className={`text-xs font-semibold mt-auto flex items-center gap-1.5 ${isSelected ? 'text-white/90' : 'text-[#4A6FA5]'}`}>
                                <Clock size={12} /> {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </button>
                    );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-1/2 flex flex-col bg-[#FBFCFE]">
            {success ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                   <div className="bg-[#E8F5E9] rounded-full p-4 mb-4">
                     <CheckCircle2 className="h-12 w-12 text-[#2E7D32]" />
                   </div>
                   <h2 className="text-xl font-bold text-[#1F3A5F] mb-2">Request Sent Successfully!</h2>
                   <p className="text-sm text-[#5A6C7D] mb-6">Your appointment request has been submitted for approval.</p>
                   <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6C7D]">
                       <Loader2 className="h-4 w-4 animate-spin" /> Returning to Dashboard...
                   </div>
               </div>
            ) : (
               <>
                 <div className="px-6 py-3 border-b border-[#E8EEF5] bg-white flex-shrink-0">
                   <h2 className="text-base font-bold text-[#1F3A5F] flex items-center gap-2">
                     <BookOpen size={18} className="text-[#4A6FA5]" /> Appointment Details
                   </h2>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                   <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
                       
                       {!selectedSlot && (
                           <div className="p-3 border border-dashed border-[#A8BCD6] bg-[#F4F7FB] rounded-lg text-center">
                               <p className="text-sm text-[#4A6FA5] font-medium">Please select a time slot from the left pane.</p>
                           </div>
                       )}

                       {selectedSlot && (
                         <div className="bg-white border border-[#DCE3ED] rounded-lg p-3 flex gap-4 shadow-sm">
                             <div className="flex-1">
                                 <label className="block text-xs font-bold text-[#5A6C7D] mb-1 uppercase tracking-wider">
                                     Start Time
                                 </label>
                                 <div className="relative">
                                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6FA5]" size={16} />
                                    <input 
                                        type="time"
                                        required
                                        value={startTime}
                                        min={`${String(new Date(selectedSlot.start).getHours()).padStart(2, '0')}:${String(new Date(selectedSlot.start).getMinutes()).padStart(2, '0')}`}
                                        max={`${String(new Date(selectedSlot.end).getHours()).padStart(2, '0')}:${String(new Date(selectedSlot.end).getMinutes()).padStart(2, '0')}`}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full rounded-md border border-[#DCE3ED] bg-[#FBFCFE] py-1.5 pl-9 pr-3 text-sm text-[#1F3A5F] font-bold outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] transition"
                                    />
                                 </div>
                             </div>
                             <div className="w-[35%]">
                                 <label className="block text-xs font-bold text-[#5A6C7D] mb-1 uppercase tracking-wider">
                                     Duration (Mins)
                                 </label>
                                 <input 
                                     type="number"
                                     required
                                     value={duration}
                                     min={10}
                                     max={(new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000}
                                     onChange={(e) => setDuration(e.target.value)}
                                     onBlur={(e) => {
                                         const maxDur = (new Date(selectedSlot.end) - new Date(selectedSlot.start)) / 60000;
                                         let val = parseInt(e.target.value);
                                         if (isNaN(val) || val < 10) val = 10;
                                         if (val > maxDur) val = maxDur;
                                         setDuration(val);
                                     }}
                                     className="w-full rounded-md border border-[#DCE3ED] bg-[#FBFCFE] py-1.5 px-3 text-sm text-[#1F3A5F] font-bold outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] transition"
                                 />
                             </div>
                         </div>
                       )}

                       <div>
                           <label className="block text-sm font-bold text-[#1F3A5F] mb-1.5">
                               Purpose of Meeting
                           </label>
                           <input 
                               type="text"
                               required
                               disabled={!selectedSlot}
                               value={purpose}
                               onChange={(e) => setPurpose(e.target.value)}
                               placeholder="e.g., Project clarification, Assignment doubt"
                               className="w-full rounded-md border border-[#DCE3ED] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] transition shadow-sm disabled:opacity-50 disabled:bg-gray-50"
                           />
                       </div>

                       <div>
                       <div className="flex gap-4">
                           <div className="flex-1">
                               <label className="block text-sm font-bold text-[#1F3A5F] mb-1.5">Meeting Nature</label>
                               <div className="flex gap-3">
                                   <label className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md font-semibold cursor-pointer transition ${isGroupMeeting ? 'bg-[#4A6FA5] text-white border-[#4A6FA5]' : 'bg-white text-[#4A6FA5] border-[#DCE3ED] hover:bg-[#F4F7FB]'} ${!selectedSlot ? 'opacity-50 pointer-events-none' : ''}`}>
                                       <input 
                                           type="checkbox" 
                                           checked={isGroupMeeting} 
                                           onChange={(e) => {
                                              setIsGroupMeeting(e.target.checked);
                                              if (!e.target.checked) setCapacity(1);
                                           }} 
                                           className="sr-only"
                                           disabled={!selectedSlot}
                                       />
                                       Group Meet
                                   </label>
                                   <label className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md font-semibold cursor-pointer transition ${isRecurringMeeting ? 'bg-[#4A6FA5] text-white border-[#4A6FA5]' : 'bg-white text-[#4A6FA5] border-[#DCE3ED] hover:bg-[#F4F7FB]'} ${!selectedSlot ? 'opacity-50 pointer-events-none' : ''}`}>
                                       <input 
                                           type="checkbox" 
                                           checked={isRecurringMeeting} 
                                           onChange={(e) => setIsRecurringMeeting(e.target.checked)} 
                                           className="sr-only"
                                           disabled={!selectedSlot}
                                       />
                                       Recurring
                                   </label>
                               </div>
                           </div>
                           
                           {isGroupMeeting && (
                             <div className="w-[100px]">
                                <label className="block text-sm font-bold text-[#1F3A5F] mb-1.5">Capacity</label>
                                <input 
                                  type="number" 
                                  min={1} 
                                  value={capacity} 
                                  onChange={(e) => setCapacity(e.target.value)}
                                  className="w-full rounded-md border border-[#DCE3ED] bg-white px-3 py-2 text-sm text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] transition shadow-sm"
                                />
                             </div>
                           )}
                       </div>
                       </div>

                       <div>
                           <label className="block text-sm font-bold text-[#1F3A5F] mb-1.5 flex items-center gap-1.5">
                               <MessageSquare size={14} className="text-[#4A6FA5]" /> Additional Notes
                           </label>
                           <textarea 
                               value={note}
                               disabled={!selectedSlot}
                               onChange={(e) => setNote(e.target.value)}
                               placeholder="Optional details or context for the faculty..."
                               className="w-full h-[68px] text-sm rounded-md border border-[#DCE3ED] bg-white px-3 py-2 text-[#1F3A5F] outline-none focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] resize-none shadow-sm transition disabled:opacity-50 disabled:bg-gray-50"
                           />
                       </div>

                   </form>
                 </div>
                 
                 {/* Fixed Bottom Action Bar */}
                 <div className="px-6 py-3 border-t border-[#E8EEF5] bg-white flex-shrink-0">
                     <button
                         type="submit"
                         form="booking-form"
                         disabled={submitting || !selectedSlot}
                         className="w-full py-2.5 rounded-md bg-[#1F3A5F] text-white font-bold text-sm shadow hover:bg-[#2B4E7A] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {submitting ? (
                           <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                         ) : (
                           "Confirm Appointment Request"
                         )}
                     </button>
                 </div>
               </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
