"use client"
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export default function FacultySchedulerHero() {
  const handleGoogleLogin = () => {
    console.log("Google login initiated");
    alert(
      "Google OAuth integration would be implemented here.\n\nIn production, this would redirect to Google authentication."
    );
  };

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center bg-[#F7F9FC] px-4 overflow-hidden ${inter.className}`}
    >
      {/* Background blobs */}
      <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(79,111,165,0.08)_0%,transparent_70%)] animate-float" />
      <div className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(31,58,95,0.05)_0%,transparent_70%)] animate-float-reverse" />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="w-full max-w-[600px]">
          {/* Brand */}
          <div className="text-center mb-8 animate-fade-down">
          <div className="relative mx-auto mb-4 w-14 h-14 bg-[#1F3A5F] rounded-md flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] animate-shimmer" />
            <svg
              className="relative z-10 w-8 h-8 stroke-white"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="8" cy="15" r="1.5" />
              <circle cx="16" cy="15" r="1.5" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#1F3A5F] tracking-tight">
            Faculty Scheduler
          </h1>
        </div>

          {/* Card */}
          <div className="bg-white border border-[#E0E0E0] rounded-md p-8 shadow-sm animate-fade-up">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1F3A5F] mb-2">
              Coordinate academic appointments with ease
            </h2>
            <p className="text-sm text-[#5A6C7D]">
              A simple system for faculty to manage office hours, student
              appointments, and academic meetings without the back-and-forth.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 rounded-md bg-[#F4F7FB] p-4 text-xs text-[#415A75] sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E8196]">
                Best for
              </p>
              <p className="mt-1 font-semibold text-[#1F3A5F]">Academic meetings</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E8196]">
                Integrates with
              </p>
              <p className="mt-1 font-semibold text-[#1F3A5F]">Google Calendar</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-[#6E8196]">
                Supports
              </p>
              <p className="mt-1 font-semibold text-[#1F3A5F]">Hybrid Appointments</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8 pb-6 border-b border-[#E0E0E0] space-y-4">
            {[
              "Set your availability and let students book appointments automatically",
              "Sync with your calendar to prevent double-booking and conflicts",
              "Manage recurring office hours and one-off meetings in one place",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-sm text-[#5A6C7D] animate-fade-left"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <svg
                  className="w-5 h-5 stroke-[#4A6FA5] mt-0.5"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {i === 0 && (
                    <>
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </>
                  )}
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-[#1F3A5F] text-white rounded-md flex items-center justify-center gap-3 text-sm font-medium transition hover:bg-[#2A4A75] hover:-translate-y-[1px] hover:shadow-lg animate-fade-up"
          >
            <span className="bg-white rounded p-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </span>
            Login with Google
          </button>

          <p className="mt-6 text-center text-xs text-[#8B98A8] animate-fade-in">
            Use your NITC Google account to get started
          </p>
          </div>
        </div>
      </div>
    </section>
  );
}
