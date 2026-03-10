"use client";
import { User, Mail, BookOpen, MapPin, Hash, UserSquare2, X, LogOut } from "lucide-react";
import { useState } from "react";

const allCourses = [
    { id: 1, code: "CS3001", name: "Operating Systems", time: "Tuesdays & Thursdays", semester: "Semester 6" },
    { id: 4, code: "CS4098", name: "B.Tech Project Phase II", time: "Friday Afternoons", semester: "Semester 8" },
    { id: 2, code: "CS4012", name: "Machine Learning", time: "Wednesdays & Fridays", semester: "Semester 8" },
    { id: 3, code: "CS2004", name: "Computer Organization", time: "Mondays & Wednesdays", semester: "Semester 4" },
    { id: 5, code: "CS4031", name: "Deep Learning", time: "Mondays & Thursdays", semester: "Semester 8" },
    { id: 6, code: "CS3004", name: "Software Engineering", time: "Tuesdays & Fridays", semester: "Semester 6" },
    { id: 7, code: "CS2001", name: "Logic Design", time: "Wednesdays & Fridays", semester: "Semester 4" },
];

export default function FacultyProfilePage() {
    const [showAllCourses, setShowAllCourses] = useState(false);

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 relative">

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F3A5F]">Faculty Profile</h1>
                <p className="text-sm text-[#5A6C7D] mt-1">
                    Manage your public directory information and credentials.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column - ID Card */}
                <div className="md:col-span-1 border border-[#DCE3ED] bg-white shadow-sm overflow-hidden flex flex-col items-center rounded-2xl h-fit">
                    <div className="w-full h-24 bg-[#1F3A5F] relative"></div>
                    <div className="relative -mt-12 mb-3">
                        <div className="h-24 w-24 rounded-full bg-white p-1 border border-[#DCE3ED] shadow-sm">
                            <div className="h-full w-full rounded-full bg-[#E8EEF5] flex items-center justify-center text-[#4A6FA5]">
                                <UserSquare2 size={40} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-[#1F3A5F] px-4 text-center">Dr. Alan Turing</h2>
                    <p className="text-sm font-medium text-[#4A6FA5] mb-2 px-4 text-center">Associate Professor</p>

                    <button
                        onClick={() => {
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            window.location.href = "/";
                        }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium transition-colors mb-6 cursor-pointer shadow-sm"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>

                    <div className="w-full border-t border-[#F0F4F8] p-4 flex flex-col gap-3 text-sm">
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Hash size={16} className="text-[#A8BCD6]" />
                            <span className="font-medium">F-2093</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <Mail size={16} className="text-[#A8BCD6]" />
                            <span className="truncate">aturing@nitc.ac.in</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#5A6C7D]">
                            <MapPin size={16} className="text-[#A8BCD6]" />
                            <span>Room 304, Main Block</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Academic & Public Info */}
                <div className="md:col-span-2 space-y-6">

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Academic & Research Profile</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-[#5A6C7D] mb-1">Department</label>
                                <p className="font-medium text-[#1F3A5F]">Computer Science and Engineering</p>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs text-[#5A6C7D] mb-1">Primary Research Focus</label>
                                <p className="font-medium text-[#1F3A5F]">Artificial Intelligence & Theory of Computation</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Highest Qualification</label>
                                <p className="font-medium text-[#1F3A5F]">Ph.D. in Computer Science</p>
                            </div>
                            <div>
                                <label className="block text-xs text-[#5A6C7D] mb-1">Years of Experience</label>
                                <p className="font-medium text-[#1F3A5F]">15+ Years</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#DCE3ED] bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[#1F3A5F]">Active Courses Hub</h3>
                        </div>

                        <div className="space-y-3">
                            {allCourses.slice(0, 2).map((course) => (
                                <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#DCE3ED] bg-[#F8FAFC]">
                                    <div className="p-2 bg-white rounded shadow-sm border border-[#E0E8F0]">
                                        <BookOpen size={16} className="text-[#4A6FA5]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#1F3A5F] text-sm">{course.code} - {course.name}</p>
                                        <p className="text-xs text-[#5A6C7D]">{course.time}</p>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setShowAllCourses(true)}
                                className="w-full mt-2 py-2.5 text-sm font-semibold text-[#4A6FA5] bg-[#E8EEF5] hover:bg-[#DCE3ED] rounded-lg transition-colors cursor-pointer"
                            >
                                View All Courses ({allCourses.length})
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Overlay */}
            {showAllCourses && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F3A5F]/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-fade-up">
                        <div className="flex items-center justify-between p-5 border-b border-[#DCE3ED]">
                            <h2 className="text-xl font-bold text-[#1F3A5F]">All Current Courses</h2>
                            <button
                                onClick={() => setShowAllCourses(false)}
                                className="p-2 text-[#5A6C7D] hover:bg-[#F4F7FB] rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8D3E0] scrollbar-track-transparent space-y-6">
                            {Object.entries(
                                allCourses.reduce((acc, course) => {
                                    if (!acc[course.semester]) acc[course.semester] = [];
                                    acc[course.semester].push(course);
                                    return acc;
                                }, {})
                            )
                                .sort((a, b) => a[0].localeCompare(b[0])) // Sort semesters alphabetically
                                .map(([semester, courses]) => (
                                    <div key={semester} className="space-y-3">
                                        <h3 className="text-sm font-bold text-[#5A6C7D] uppercase tracking-wider border-b border-[#DCE3ED] pb-2">{semester}</h3>
                                        {courses.map((course) => (
                                            <div key={course.id} className="flex items-center gap-3 p-4 rounded-xl border border-[#DCE3ED] bg-[#F8FAFC] hover:border-[#9CB3CC] transition-colors">
                                                <div className="p-3 bg-white rounded-lg shadow-sm border border-[#E0E8F0]">
                                                    <BookOpen size={20} className="text-[#4A6FA5]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1F3A5F] text-sm">{course.code} - {course.name}</p>
                                                    <p className="text-xs font-medium text-[#5A6C7D] mt-0.5">{course.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                        </div>

                        <div className="p-4 border-t border-[#DCE3ED] bg-[#F8FAFC]">
                            <button
                                onClick={() => setShowAllCourses(false)}
                                className="w-full py-2.5 bg-[#1F3A5F] text-white font-medium rounded-lg hover:bg-[#2A4A75] transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
