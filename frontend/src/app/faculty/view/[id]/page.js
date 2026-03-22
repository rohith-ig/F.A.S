"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../../axios";
import { Loader2, ArrowLeft, CalendarClock, Clock, User, Check, X, CalendarOff } from "lucide-react";
import Link from "next/link";

export default function FacultyAppointmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      await api.post(`/appmt/update/${id}`, { status });
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      
      <Link href="/faculty/list" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A6FA5] hover:text-[#1F3A5F] transition mb-6">
          <ArrowLeft size={16} /> Back to Appointments
      </Link>

      <div className="bg-white border border-[#DCE3ED] rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#E8EEF5] pb-6">
            <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                    appointment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    appointment.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                }`}>
                    {appointment.status}
                </span>
                <h1 className="text-2xl font-bold text-[#1F3A5F]">{appointment.purpose}</h1>
                <p className="text-[#5A6C7D] mt-2">Appointment Request ID: #{appointment.id}</p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-[#DCE3ED] rounded-lg p-4 min-w-[200px] text-center">
                <p className="text-[#1F3A5F] font-bold">{dateString}</p>
                <p className="text-[#4A6FA5] font-semibold mt-1">{timeString}</p>
            </div>
        </div>

        <div className="space-y-6 mb-8">
            <div>
                <h3 className="text-sm font-bold text-[#6C8096] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <User size={16} /> Student Information
                </h3>
                <div className="bg-[#FBFCFE] p-4 rounded-lg border border-[#E8EEF5]">
                    <p className="text-lg font-bold text-[#1F3A5F]">{appointment.student.user.name}</p>
                    <p className="text-[#5A6C7D] font-medium mt-1">Roll Number: {appointment.student.rollNumber}</p>
                    <p className="text-[#5A6C7D] font-medium">Department: {appointment.student.department}</p>
                    <p className="text-[#5A6C7D] mt-1">{appointment.student.user.email}</p>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-[#6C8096] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Clock size={16} /> Appointment Overview
                </h3>
                <div className="bg-[#FBFCFE] p-4 rounded-lg border border-[#E8EEF5] grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <p className="text-[#5A6C7D] text-sm">Duration</p>
                        <p className="text-[#1F3A5F] font-semibold">{duration} Minutes</p>
                     </div>
                     <div>
                        <p className="text-[#5A6C7D] text-sm">Target Faculty</p>
                        <p className="text-[#1F3A5F] font-semibold">You</p>
                     </div>
                </div>
            </div>

            {appointment.note && (
                <div>
                    <h3 className="text-sm font-bold text-[#6C8096] uppercase tracking-wider mb-2">
                        Student Note
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#E8EEF5] text-[#1F3A5F]">
                        {appointment.note}
                    </div>
                </div>
            )}
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DCE3ED]">
             {appointment.status === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button 
                        onClick={() => handleStatusUpdate('APPROVED')}
                        disabled={updating}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                         <Check size={18} /> Approve Request
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate('REJECTED')}
                         disabled={updating}
                         className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                         <X size={18} /> Reject Request
                      </button>
                  </div>
             )}

             {appointment.status === 'APPROVED' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                       <button 
                         onClick={() => handleStatusUpdate('CANCELLED')}
                         disabled={updating}
                         className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                         <CalendarOff size={18} /> Cancel Appointment
                      </button>
                      <button 
                        onClick={handleReschedule}
                        disabled={updating}
                        className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#1F3A5F] hover:bg-[#2A4A75] text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                         <Clock size={18} /> Reschedule
                      </button>
                  </div>
             )}

             {(appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') && (
                  <div className="text-center py-2">
                      <p className="text-[#5A6C7D] font-medium">This appointment is closed and requires no further action.</p>
                  </div>
             )}
        </div>
      </div>
    </div>
  );
}
