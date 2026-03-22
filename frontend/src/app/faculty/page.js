'use client'
import Link from "next/link";
import {
    CalendarClock,
    Users,
    Clock,
    MessageSquareWarning,
    ArrowRight,
    Settings,
} from "lucide-react";
import api from "../../axios";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";const facultyAppointments = [
    {
        id: 101,
        studentName: "Ada Lovelace",
        studentId: "B230001CS",
        date: "Oct 24, 2026",
        time: "10:30 AM",
        status: "Pending",
        purpose: "Final Year Project Discussion"
    },
    {
        id: 102,
        studentName: "Charles Babbage",
        studentId: "B230002CS",
        date: "Oct 25, 2026",
        time: "11:00 AM",
        status: "Confirmed",
        purpose: "Doubt Clearance - OS"
    }
];


const quickActions = [
    {
        title: "My Schedule",
        desc: "Manage your weekly availability and mark busy slots.",
        icon: CalendarClock,
        href: "/faculty/schedule",
        color: "bg-[#4A6FA5]/10 text-[#4A6FA5]",
    },
    {
        title: "Appointment Requests",
        desc: "Approve, reject, or reschedule pending meetings.",
        icon: Users,
        href: "/faculty/list", // or requests according to SRS
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        title: "Settings",
        desc: "Configure auto-approval rules and defaults.",
        icon: Settings,
        href: "/faculty/settings",
        color: "bg-[#1F3A5F]/10 text-[#1F3A5F]",
    },
    {
        title: "Raise a Ticket",
        desc: "Report an issue to the administration.",
        icon: MessageSquareWarning,
        href: "/faculty/tickets",
        color: "bg-rose-100 text-rose-700",
    },
];

export default function FacultyDashboard() {
    const [facultyAppointments, setFacultyAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/appmt');
            console.log('Fetched appointments:', response.data);
            setFacultyAppointments(response.data);
        } catch (error) {
            console.error('Error fetching faculty appointments:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);


    const pendingRequests = [...facultyAppointments]
        .filter(apt => apt.status === 'PENDING')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id)
        .slice(0, 4);
    
    const handleStatusUpdate = async (id, status) => {
        try {
            await api.post(`/appmt/update/${id}`, { status });
            await fetchDetails(); // Re-fetch all data to ensure sync
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
                <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
                <p className="text-sm font-medium">Loading Dashboard Data...</p>
            </div>
        );
    }
    return (
        <div className="mx-auto w-full max-w-6xl px-4">
            {/* Quick Actions Grid */}
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-[#1F3A5F]">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group flex flex-col items-start justify-between rounded-xl border border-[#DCE3ED] bg-white p-5 shadow-sm transition-all hover:border-[#4A6FA5]/30 hover:shadow-md"
                        >
                            <div className={`mb-4 rounded-lg p-3 ${action.color}`}>
                                <action.icon size={24} />
                            </div>
                            <div>
                                <h3 className="mb-1 font-semibold text-[#1F3A5F] group-hover:text-[#4A6FA5] transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-[#5A6C7D]">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Appointment Analytics & Pending Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Stats */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="rounded-xl border border-[#DCE3ED] bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#5A6C7D] uppercase tracking-wider mb-2">Pending Requests</h3>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                                <Clock size={28} />
                            </div>
                            <span className="text-4xl font-bold text-[#1F3A5F]">{facultyAppointments.filter(apt => apt.status === 'PENDING').length}</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#DCE3ED] bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#5A6C7D] uppercase tracking-wider mb-2">Confirmed Today</h3>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                                <CalendarClock size={28} />
                            </div>
                            <span className="text-4xl font-bold text-[#1F3A5F]">
                                {facultyAppointments.filter(apt => apt.status === 'Confirmed').length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Pending List */}
                <section className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#1F3A5F]">Action Required</h2>
                    </div>

                    <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm overflow-hidden">
                        {pendingRequests.length > 0 ? (
                            <>
                                <ul className="divide-y divide-[#DCE3ED]">
                                    {pendingRequests.map((apt) => (
                                        <li key={apt.id} className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[60px] border border-[#4A6FA5]/20">
                                                    <span className="block text-xs font-bold text-[#4A6FA5] uppercase">{new Date(apt.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                    <span className="block text-lg font-bold text-[#1F3A5F]">{new Date(apt.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#1F3A5F] text-lg">{apt.students[0].student.user.name} <span className="text-sm font-normal text-[#5A6C7D]">({apt.students[0].student.rollNumber})</span></h4>
                                                    <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                                                        <Clock size={14} /> {new Date(apt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {apt.purpose}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleStatusUpdate(apt.id, 'APPROVED')} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer shadow-sm">
                                                    Approve
                                                </button>
                                                <button onClick={() => handleStatusUpdate(apt.id, 'REJECTED')} className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-4 py-2 rounded-md text-sm font-semibold transition cursor-pointer shadow-sm">
                                                    Reject
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-4 text-center border-t border-[#DCE3ED] bg-[#FBFCFE]">
                                    <Link href="/faculty/list" className="text-[#4A6FA5] text-sm font-semibold hover:underline">
                                        View All Pending Requests →
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center text-[#5A6C7D]">
                                <CalendarClock className="mx-auto h-12 w-12 text-[#DCE3ED] mb-3" />
                                <p>You have no pending appointment requests.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
