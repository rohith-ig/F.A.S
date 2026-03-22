"use client";

import { Calendar, User, Clock, Mail, BookOpen, MapPin, Users, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import api from "../../../../axios";

export default function ManageRequests() {

  const params = useSearchParams();

  const name = params.get("name") || "facultyName";
  const email = params.get("email") || "notFound";
  const dept = params.get("dept") || "notFound";
  const date = params.get("date") || "notFound";
  const time = params.get("time") || "notFound";
  const status = params.get("status");

  const location = params.get("location") || "notFound";

  const cancelNote = params.get("cancelNote");
  const aptId = params.get("id");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [capacity, setCapacity] = useState(1);
  const [isGroup, setIsGroup] = useState(false);
  const [students, setStudents] = useState([]);
  const [creatorId, setCreatorId] = useState(null);
  
  const [purpose, setPurpose] = useState("Loading...");
  const [note, setNote] = useState("Loading...");
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchApt = useCallback(async () => {
    if (!aptId) return;
    try {
       const response = await api.get('/appmt');
       const found = response.data.find(a => String(a.id) === String(aptId));
       if (found) {
           setCapacity(found.capacity || 1);
           setIsGroup(found.isGroup || false);
           setStudents(found.students || []);
           setCreatorId(found.studentId);
           setPurpose(found.purpose || "Not Specified");
           setNote(found.note || "No additional notes provided.");
       }
    } catch (error) {
       console.error("Failed to fetch group details:", error);
    }
  }, [aptId]);

  useEffect(() => {
    fetchApt();
  }, [fetchApt]);

  const handleInvite = async () => {
      if (!inviteEmail.trim()) {
          alert("Please enter a valid email to invite.");
          return;
      }
      setInviting(true);
      try {
          // Based on backend implementation `/addMember` inside the Appointment router
          await api.post('/appmt/addMember', {
              appmtId: aptId,
              email: inviteEmail
          });
          alert("Group member added successfully!");
          setInviteEmail("");
          fetchApt(); // Refresh the list seamlessly
      } catch (error) {
          const errMsg = error.response?.data?.error || "Failed to add member to the group.";
          alert(errMsg);
      } finally {
          setInviting(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-inter relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#4A6FA5]/20 blur-3xl rounded-full animate-float" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1F3A5F]/10 blur-3xl rounded-full animate-float-slow" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 relative z-10">

        {/* Page Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-[#1F3A5F] mb-2">Appointment Request</h2>

        </div>

        {/* Appointment Details */}
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-[#1F3A5F]">Appointment Information</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
               status === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
               status === "Pending" ? "bg-amber-100 text-amber-700" :
               "bg-rose-100 text-rose-700"
            }`}>
               {status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-base text-gray-700 mb-6">
            <div className="flex items-center gap-3">
              <User size={18} className="text-[#4A6FA5]" />
              <span>Faculty: {name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#4A6FA5]" />
              <span>Email: {email}</span>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen size={18} className="text-[#4A6FA5]" />
              <span>Department: {dept}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#4A6FA5]" />
              <span>Date: {date}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-[#4A6FA5]" />
              <span>Time: {time}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#4A6FA5]" />
              <span>Location: {location}</span>
            </div>
          </div>
          
          <div className="border-t border-[#E8EEF5] pt-6 mt-2">
            <h4 className="text-sm font-bold text-[#1F3A5F] mb-1.5 flex items-center gap-2"><BookOpen size={16} className="text-[#4A6FA5]" /> Purpose</h4>
            <p className="text-sm text-gray-700 mb-5 leading-relaxed">{purpose}</p>
            
            <h4 className="text-sm font-bold text-[#1F3A5F] mb-1.5 align-middle">Additional Notes</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] p-4 rounded border border-[#E8EEF5]">{note}</p>
          </div>
          
          {(status === "Cancelled" || status === "Rejected") && cancelNote && (
            <div className="mt-6 p-4 rounded-lg bg-rose-50 border border-rose-100">
               <h4 className="text-sm font-bold text-rose-800 mb-1">Cancellation Note</h4>
               <p className="text-sm text-rose-700">{cancelNote}</p>
            </div>
          )}

          {isGroup && (
            <div className="mt-6 p-5 rounded-lg bg-[#F8FAFC] border border-[#DCE3ED]">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center gap-2 text-base font-bold text-[#1F3A5F]"><Users size={16} className="text-[#4A6FA5]" /> Group Meeting Participants</h4>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-bold">Capacity: {students.length}/{capacity}</span>
               </div>
               
               <div className="space-y-2 mb-4">
                  {students.map((s, idx) => (
                      <div key={s?.student?.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-md border border-[#E8EEF5]">
                          <div>
                              <p className="font-semibold text-sm text-[#1F3A5F] flex items-center gap-2">
                                  {s?.student?.user?.name || "Unknown Student"}
                                  {s?.student?.id === creatorId && (
                                     <span className="text-[10px] bg-[#E8EEF5] text-[#4A6FA5] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-[#DCE3ED]">Organizer</span>
                                  )}
                              </p>
                              <p className="text-xs text-[#5A6C7D] mt-0.5">{s?.student?.user?.email || "No Email"}</p>
                          </div>
                      </div>
                  ))}
               </div>

               {students.length < capacity && status !== "Completed" && status !== "Cancelled" && status !== "Rejected" && (
                   <div className="pt-4 border-t border-[#E8EEF5]">
                       <p className="text-sm font-semibold text-[#1F3A5F] mb-2">Invite Additional Members</p>
                       <div className="flex items-center gap-3">
                           <input 
                               type="email" 
                               value={inviteEmail}
                               onChange={(e) => setInviteEmail(e.target.value)}
                               disabled={inviting}
                               placeholder="Student email address..." 
                               className="flex-1 text-sm px-3 py-2 rounded-md border border-[#DCE3ED] outline-none focus:border-[#4A6FA5] disabled:opacity-50"
                           />
                           <button 
                               onClick={handleInvite}
                               disabled={inviting || !inviteEmail.trim()}
                               className="flex items-center gap-2 bg-[#4A6FA5] hover:bg-[#3f5e8a] text-white text-sm px-4 py-2 rounded-md font-medium transition whitespace-nowrap disabled:opacity-50"
                           >
                               {inviting ? <><Loader2 size={16} className="animate-spin" /> Inviting</> : "Send Invite"}
                           </button>
                       </div>
                   </div>
               )}
            </div>
          )}
        </div>

        {/* Cancel Button */}
        {(status !== "Completed" && status !== "Cancelled" && status !== "Rejected") && (
          <div className="mb-10">
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-3 rounded-lg transition"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Appointment
            </button>
          </div>
        )}


      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-20 animate-fade">
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-8 w-full max-w-md">
            <h3 className="text-xl font-semibold text-[#1F3A5F] mb-4">Cancel Appointment</h3>

            <label className="text-sm text-gray-600 block mb-2">
              Reason for cancellation
            </label>

            <textarea
              placeholder="Explain why you are cancelling this appointment..."
              className="w-full border border-[#E0E0E0] rounded-lg p-3 text-base mb-6"
            />

            <div className="flex gap-3 justify-end">
              <button
                className="border border-[#E0E0E0] px-4 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>

              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                Confirm Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-float {
            animation: float 12s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float 18s ease-in-out infinite;
          }

          .animate-fade {
            animation: fade 0.2s ease;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes fade {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
