import Link from "next/link";
import {
    CalendarClock,
    Users,
    Clock,
    MessageSquareWarning,
    ArrowRight,
    Settings,
} from "lucide-react";

const facultyAppointments = [
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
    const pendingRequests = facultyAppointments.filter(apt => apt.status === 'Pending');

    return (
        <div className="mx-auto w-full max-w-6xl px-4">
            {/* Header Section */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F3A5F]">
                        Welcome back, Faculty!
                    </h1>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Manage your schedule, respond to student requests, and oversee your appointments.
                    </p>
                </div>
                <Link
                    href="/faculty/list"
                    className="inline-flex items-center gap-2 rounded-md bg-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2A4A75]"
                >
                    View All Requests <ArrowRight size={16} />
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
                            <span className="text-4xl font-bold text-[#1F3A5F]">{pendingRequests.length}</span>
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
                            <ul className="divide-y divide-[#DCE3ED]">
                                {pendingRequests.map((apt) => (
                                    <li key={apt.id} className="p-5 hover:bg-[#F8FAFC] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#4A6FA5]/10 rounded-lg p-3 text-center min-w-[60px] border border-[#4A6FA5]/20">
                                                <span className="block text-xs font-bold text-[#4A6FA5] uppercase">{apt.date.split(' ')[0]}</span>
                                                <span className="block text-lg font-bold text-[#1F3A5F]">{apt.date.split(' ')[1].replace(',', '')}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[#1F3A5F] text-lg">{apt.studentName} <span className="text-sm font-normal text-[#5A6C7D]">({apt.studentId})</span></h4>
                                                <p className="text-sm text-[#5A6C7D] flex items-center gap-2 mt-1">
                                                    <Clock size={14} /> {apt.time} • {apt.purpose}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer">
                                                Approve
                                            </button>
                                            <button className="border border-[#DCE3ED] bg-white hover:bg-gray-50 text-[#5A6C7D] px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer">
                                                Review
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
