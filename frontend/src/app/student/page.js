"use client";
import Link from "next/link";
import api from "../../axios.js";
import { useEffect, useState, useCallback } from "react";

import {
    Search,
    CalendarCheck,
    Clock,
    MessageSquareWarning,
    ArrowRight,
    Loader2
} from "lucide-react";

const quickActions = [
    {
        title: "Search Faculty",
        desc: "Find faculty members to book an appointment.",
        icon: Search,
        href: "/student/search",
        color: "bg-[#4A6FA5]/10 text-[#4A6FA5]",
    },
    {
        title: "My Requests",
        desc: "View the status of your pending appointment requests.",
        icon: Clock,
        href: "/student/req",
        color: "bg-amber-100 text-amber-700",
    },
    {
        title: "Past Appointments",
        desc: "Review your pending requests and appointment history.",
        icon: CalendarCheck,
        href: "/student/history", 
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        title: "Raise a Ticket",
        desc: "Report an issue or request support.",
        icon: MessageSquareWarning,
        href: "/student/tickets",
        color: "bg-rose-100 text-rose-700",
    },
];

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [userRes, appmtRes] = await Promise.all([
                api.get('/users/get'),
                api.get('/appmt')
            ]);
            setUser(userRes.data.user);
            // Filter to get upcoming (APPROVED) and pending appointments if desired, 
            // but let's just show top 3 upcoming APPROVED ones sorted by date
            const upcoming = appmtRes.data
                .filter(a => a.status === 'APPROVED' && new Date(a.start) > new Date())
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .slice(0, 3);
            
            setAppointments(upcoming);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
                <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
                <p className="text-sm font-medium">Loading Dashboard Data...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4">
            {/* Header Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F]">
                        Welcome back, {user?.name || 'Student'}
                    </h1>
                    <p className="text-sm text-[#5A6C7D] mt-1 flex items-center gap-2">
                        {user?.studentProfile?.rollNumber} • {user?.studentProfile?.department}
                    </p>
                    <p className="text-sm text-[#5A6C7D] mt-4">
                        Manage your appointments, check faculty availability, and track requests.
                    </p>
                </div>
                <Link
                    href="/student/search"
                    className="inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2A4A75]"
                >
                    Book Appointment <ArrowRight size={16} />
                </Link>
            </header>

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

            {/* Upcoming Appointments Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#1F3A5F]">Upcoming Appointments</h2>
                    <Link href="/student/history" className="text-sm text-[#4A6FA5] hover:underline font-medium">View All</Link>
                </div>

                <div className="bg-white rounded-xl border border-[#DCE3ED] shadow-sm overflow-hidden">
                    {appointments.length > 0 ? (
                        <ul className="divide-y divide-[#DCE3ED]">
                            {appointments.map((apt) => {
                                const startDate = new Date(apt.start);
                                const timeString = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const dateString = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                
                                return (
                                <li key={apt.id} className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[70px] border border-[#4A6FA5]/20">
                                            <span className="block text-xs font-bold text-[#4A6FA5] uppercase">{dateString.split(' ')[0]} {dateString.split(' ')[1].replace(',', '')}</span>
                                            <span className="block text-[15px] font-bold text-[#1F3A5F]">{timeString}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1F3A5F] text-lg">{apt.faculty.user.name}</h4>
                                            <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                                                <Clock size={14} /> Duration: {(new Date(apt.end) - new Date(apt.start)) / 60000} min
                                            </p>
                                            <p className="text-sm text-[#5A6C7D] mt-1 space-x-1">
                                                <span className="font-medium text-[#1F3A5F]">Purpose:</span> <span>{apt.purpose}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                            {apt.status}
                                        </span>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-[#5A6C7D]">
                            <CalendarCheck className="mx-auto h-12 w-12 text-[#DCE3ED] mb-3" />
                            <p>No upcoming appointments.</p>
                            <Link href="/student/search" className="text-[#4A6FA5] hover:underline mt-2 inline-block">Book one now</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
