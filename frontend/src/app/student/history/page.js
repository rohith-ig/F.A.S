"use client"
import Link from "next/link";
import { User, Calendar, Clock, ChevronRight, Filter } from "lucide-react";

const studentAppointments = [
    {
        id: 1,
        faculty: "Dr. Alan Turing",
        date: "Oct 24, 2026",
        time: "10:30 AM",
        status: "Confirmed",
        type: "Project Review",
        dept: "Computer Science",
        email: "alan@edu.in",
        location: "MB - 209"
    },
    {
        id: 2,
        faculty: "Prof. Grace Hopper",
        date: "Oct 26, 2026",
        time: "2:00 PM",
        status: "Pending",
        type: "Guidance",
        dept: "Computer Science",
        email: "grace@edu.in",
        location: "MB - 101"

    }
];

export default function StudentHistoryPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">

            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F]">
                        Appointment History
                    </h1>
                </div>

                <button className="inline-flex items-center gap-2 rounded-md border border-[#DCE3ED] bg-white px-4 py-2 text-sm font-medium text-[#1F3A5F] transition hover:bg-[#F4F7FB] cursor-pointer">
                    <Filter size={16} /> Filter Output
                </button>
            </header>

            <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm overflow-hidden">
                {studentAppointments.length > 0 ? (
                    <ul className="divide-y divide-[#DCE3ED]">

                        {studentAppointments.map((apt) => (
                            <li
                                key={apt.id}
                                className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >

                                <div className="flex items-start gap-4 h-full">

                                    <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[60px] border border-[#4A6FA5]/20">
                                        <span className="block text-xs font-bold text-[#4A6FA5] uppercase">
                                            {apt.date.split(" ")[0]}
                                        </span>
                                        <span className="block text-lg font-bold text-[#1F3A5F]">
                                            {apt.date.split(" ")[1].replace(",", "")}
                                        </span>
                                    </div>

                                    <div className="flex flex-col h-full justify-between">
                                        <h4 className="font-semibold text-[#1F3A5F] text-lg">
                                            {apt.faculty}
                                        </h4>

                                        <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                                            <Clock size={14} /> {apt.time} • {apt.type}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            apt.status === "Confirmed"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : apt.status === "Pending"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-rose-100 text-rose-700"
                                        }`}
                                    >
                                        {apt.status}
                                    </span>

                                    {/* NAVIGATE TO MANAGE PAGE */}
                                    <Link
                                    href={`/student/history/manage?name=${encodeURIComponent(apt.faculty)}&date=${encodeURIComponent(apt.date)}&time=${apt.time}&dept=${apt.dept}&email=${apt.email}&location=${apt.location}`}
                                    className="text-[#5A6C7D] hover:text-[#4A6FA5] p-2 rounded-md hover:bg-[#F4F7FB] transition cursor-pointer"
                                    >
                                    <ChevronRight size={20} />
                                    </Link>


                                </div>

                            </li>
                        ))}

                        {/* Example old appointment */}
                        <li className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">

                            <div className="flex items-start gap-4 h-full">

                                <div className="bg-[#E8EEF5] rounded-lg p-3 text-center min-w-[60px] border border-[#DCE3ED]">
                                    <span className="block text-xs font-bold text-[#5A6C7D] uppercase">
                                        Sep
                                    </span>
                                    <span className="block text-lg font-bold text-[#1F3A5F]">
                                        12
                                    </span>
                                </div>

                                <div className="flex flex-col h-full justify-between">
                                    <h4 className="font-semibold text-[#1F3A5F] text-lg">
                                        Dr. John von Neumann
                                    </h4>

                                    <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                                        <Clock size={14} /> 9:00 AM • Initial Meet
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                    Completed
                                </span>

                                <button className="text-[#5A6C7D] hover:text-[#4A6FA5] p-2 rounded-md hover:bg-[#F4F7FB] transition cursor-pointer">
                                    <ChevronRight size={20} />
                                </button>

                            </div>

                        </li>

                    </ul>
                ) : (
                    <div className="p-12 text-center text-[#5A6C7D]">
                        <Calendar className="mx-auto h-12 w-12 text-[#DCE3ED] mb-3" />
                        <p className="text-lg font-medium text-[#1F3A5F]">
                            No history found.
                        </p>
                        <p className="mt-1">
                            You haven't had any appointments yet.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}
