"use client";

import { Calendar, User, Clock, Mail, BookOpen, MapPin } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ManageRequests() {

  const params = useSearchParams();

  const name = params.get("name") || "facultyName";
  const email = params.get("email") || "notFound";
  const dept = params.get("dept") || "notFound";
  const date = params.get("date") || "notFound";
  const time = params.get("time") || "notFound";
  const location = params.get("location") || "notFound";

  const [showCancelModal, setShowCancelModal] = useState(false);


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
          <h3 className="text-xl font-semibold text-[#1F3A5F] mb-6">Appointment Information</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-base text-gray-700">
            <div className="flex items-center gap-3">
              <User size={18} />
              <span>Faculty: {name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>Email: {email}</span>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <span>Department:{dept}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <span>Date:{date}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} />
              <span>Time: {time}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>Location: {location}</span>
            </div>
          </div>

          <div className="mt-6 text-base text-gray-700">
            <p className="font-medium text-[#1F3A5F] mb-1">Purpose of Appointment</p>
            <p className="text-gray-600">
              Discussion regarding final year project supervision and timeline planning.
            </p>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="mb-10">
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-base px-6 py-3 rounded-lg transition"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Appointment
          </button>
        </div>

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
