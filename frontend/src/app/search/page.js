"use client"
import { useState } from "react";
import { Search } from "lucide-react";
import BackArrowButton from "@/components/BackArrowButton";

export default function SearchFaculty() {
  const facultyList = [
    {
      name: "Dr. Ananya Rao",
      role: "Professor",
      status: "Available",
      courses: "Data Structures, Algorithms, Operating Systems",
      location: "Block A · Room 302",
      color: "green",
    },
    {
      name: "Mr. Karthik Menon",
      role: "Assistant Professor",
      status: "Busy",
      courses: "Database Systems, Web Technologies",
      location: "Block B · Room 214",
      color: "yellow",
    },
    {
      name: "Ms. Neha Iyer",
      role: "Teaching Fellow",
      status: "On Leave",
      courses: "Machine Learning, Python Programming",
      location: "Block C · Room 108",
      color: "red",
    },
  ];

  const [searchMode, setSearchMode] = useState("name");
  const [searchText, setSearchText] = useState("");

  const filteredFaculty = facultyList.filter((f) => {
    const value = searchMode === "name" ? f.name : f.role;

    return value.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-4">
          <BackArrowButton />
        </div>
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F3A5F] text-white font-semibold">
            FS
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1F3A5F]">Search Faculty</h1>
            <p className="text-sm text-[#5A6C7D]">Find faculty by name or designation.</p>
          </div>
        </header>

        <section className="mb-6 rounded-lg border border-[#DCE3ED] bg-white p-4 shadow-sm">
          <p className="text-sm text-[#5A6C7D]">
            Locate faculty members and view their availability context before booking.
          </p>
        </section>

        <section className="mb-6 flex flex-col items-stretch gap-3 rounded-lg border border-[#DCE3ED] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A6FA5]" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={searchMode === "name" ? "Search by faculty name" : "Search by designation"}
              className="w-full rounded-lg border border-[#DCE3ED] bg-[#FBFCFE] py-3 pl-10 pr-4 text-sm text-[#1F3A5F] outline-none ring-[#A8BCD6] transition focus:ring-2"
            />
          </div>

          <div className="flex overflow-hidden rounded-md border border-[#C8D3E0]">
            <button
              onClick={() => setSearchMode("name")}
              className={`px-4 py-2 text-sm transition ${
                searchMode === "name"
                  ? "bg-[#1F3A5F] text-white"
                  : "bg-white text-[#1F3A5F] hover:bg-[#F3F6FA]"
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchMode("designation")}
              className={`px-4 py-2 text-sm transition ${
                searchMode === "designation"
                  ? "bg-[#1F3A5F] text-white"
                  : "bg-white text-[#1F3A5F] hover:bg-[#F3F6FA]"
              }`}
            >
              Designation
            </button>
          </div>
        </section>

        <section className="grid gap-4">
          {filteredFaculty.length === 0 ? (
            <p className="rounded-lg border border-[#DCE3ED] bg-white p-5 text-sm text-[#5A6C7D] shadow-sm">
              No faculty found for this search.
            </p>
          ) : (
            filteredFaculty.map((faculty) => <FacultyCard key={faculty.name} {...faculty} />)
          )}
        </section>
      </section>
    </main>
  );
}

function FacultyCard({ name, role, status, courses, location, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <article className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F3A5F]">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${colorMap[color]}`}>
          {status}
        </span>
      </div>

      <p className="mb-1 text-sm text-[#2A4A75]">{role}</p>

      <p className="mb-1 text-xs text-[#5A6C7D]">
        <span className="font-medium text-[#1F3A5F]">Courses:</span>{" "}
        {courses}
      </p>

      <p className="text-xs text-[#5A6C7D]">
        <span className="font-medium text-[#1F3A5F]">Location:</span>{" "}
        {location}
      </p>
    </article>
  );
}
