"use client"
import Link from "next/link";
import { useState } from "react";
import { Calendar, Clock, ChevronRight, Filter } from "lucide-react";

export default function StudentHistoryPage() {

    const [appointments, setAppointments] = useState([
        {
            id: 1,
            faculty: "Dr. Alan Turing",
            date: "Oct 24, 2026",
            time: "10:30 AM",
            status: "Action pending",
            rescheduleRequested: true,
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
            rescheduleRequested: false,
            type: "Guidance",
            dept: "Computer Science",
            email: "grace@edu.in",
            location: "MB - 101"
        },
        {
            id: 3,
            faculty: "Prof. Medha Shankar",
            date: "Mar 3, 2026",
            time: "4:15 PM",
            status: "Completed",
            rescheduleRequested: false,
            type: "Guidance",
            dept: "Computer Science",
            email: "medha@edu.in",
            location: "MB - 101"
        }
    ]);

    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilter, setShowFilter] = useState(false);

    const rescheduleRequests = appointments.filter(
        (apt) => apt.rescheduleRequested
    );

    const filteredAppointments =
        statusFilter === "All"
            ? appointments
            : appointments.filter(
                (apt) => apt.status === statusFilter
            );

    const handleCancelAppointment = (id) => {

        const updatedAppointments = appointments.filter(
            (apt) => apt.id !== id
        );

        setAppointments(updatedAppointments);

        alert("Appointment cancelled. Faculty will be notified.");
    };

    const handlePickNewSlot = (apt) => {

        const query = new URLSearchParams({
            name: apt.faculty,
            email: apt.email,
            dept: apt.dept
        });

        window.location.href = `/student/reschedule?${query}`;
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4">

            {/* HEADER */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F]">
                        Appointment History
                    </h1>
                </div>

                {/* FILTER BUTTON */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="inline-flex items-center gap-2 rounded-md border border-[#DCE3ED] bg-white px-4 py-2 text-sm font-medium text-[#1F3A5F] transition hover:bg-[#F4F7FB]"
                    >
                        <Filter size={16} /> Filter Output
                    </button>

                    {showFilter && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-[#DCE3ED] rounded-md shadow-sm z-10">

                            {["All", "Confirmed", "Pending", "Completed"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setShowFilter(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#F4F7FB] ${
                                        statusFilter === status
                                            ? "text-[#1F3A5F] font-medium"
                                            : "text-[#5A6C7D]"
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}

                        </div>
                    )}
                </div>

            </header>


            {/* RESCHEDULE REQUEST BOX */}
            {rescheduleRequests.length > 0 && (

                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">

                    <h3 className="font-semibold text-amber-800 mb-3">
                        Reschedule Requests
                    </h3>

                    {rescheduleRequests.map((apt) => (

                        <div
                            key={apt.id}
                            className="flex justify-between items-center mb-3"
                        >

                            <div>

                                <p className="text-sm font-medium text-[#1F3A5F]">
                                    {apt.faculty} requested to reschedule your appointment
                                </p>

                                <p className="text-xs text-[#5A6C7D]">
                                    {apt.date} • {apt.time}
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => handlePickNewSlot(apt)}
                                    className="px-3 py-1 text-sm bg-[#4A6FA5] text-white rounded-md hover:bg-[#3f5e8a]"
                                >
                                    Pick New Slot
                                </button>

                                <button
                                    onClick={() => handleCancelAppointment(apt.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}


            {/* APPOINTMENT LIST */}
            <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm overflow-hidden">

                {filteredAppointments.length > 0 ? (

                    <ul className="divide-y divide-[#DCE3ED]">

                        {filteredAppointments.map((apt) => (

                            <li
                                key={apt.id}
                                className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >

                                <div className="flex items-start gap-4">

                                    <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[60px] border border-[#4A6FA5]/20">
                                        <span className="block text-xs font-bold text-[#4A6FA5] uppercase">
                                            {apt.date.split(" ")[0]}
                                        </span>

                                        <span className="block text-lg font-bold text-[#1F3A5F]">
                                            {apt.date.split(" ")[1].replace(",", "")}
                                        </span>
                                    </div>

                                    <div>

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
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {apt.status}
                                    </span>

                                    <Link
                                        href={`/student/history/manage?name=${encodeURIComponent(apt.faculty)}&date=${encodeURIComponent(apt.date)}&time=${apt.time}&dept=${apt.dept}&email=${apt.email}&location=${apt.location}&status=${apt.status}`}
                                        className="text-[#5A6C7D] hover:text-[#4A6FA5] p-2 rounded-md hover:bg-[#F4F7FB] transition"
                                    >
                                        <ChevronRight size={20} />
                                    </Link>

                                </div>

                            </li>

                        ))}

                    </ul>

                ) : (

                    <div className="p-12 text-center text-[#5A6C7D]">

                        <Calendar className="mx-auto h-12 w-12 text-[#DCE3ED] mb-3" />

                        <p className="text-lg font-medium text-[#1F3A5F]">
                            No appointments found.
                        </p>

                        <p className="mt-1">
                            No results for selected filter.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}