"use client"
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import BackArrowButton from "@/components/BackArrowButton";
import { facultyProfiles } from "./facultyData";

export default function SearchFaculty() {
  const [searchMode, setSearchMode] = useState("name");
  const [searchText, setSearchText] = useState("");

  const filteredFaculty = facultyProfiles.filter((f) => {
    const value = searchMode === "name" ? f.name : f.designation;

    return value.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 ">
      <section className="mx-auto w-full max-w-5xl">
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
            filteredFaculty.map((faculty) => <FacultyCard key={faculty.id} {...faculty} />)
          )}
        </section>
      </section>
    </main>
  );
}

function FacultyCard({ id, name, designation, status, courses, location, statusColor }) {

  return (
    <article className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F3A5F]">{name}</h3>
      </div>

      <p className="mb-1 text-sm text-[#2A4A75]">{designation}</p>

      <p className="mb-1 text-xs text-[#5A6C7D]">
        <span className="font-medium text-[#1F3A5F]">Courses:</span>{" "}
        {courses}
      </p>

      <p className="text-xs text-[#5A6C7D]">
        <span className="font-medium text-[#1F3A5F]">Location:</span>{" "}
        {location}
      </p>

      <Link
        href={`/student/req/${id}`}
        className="mt-4 inline-flex rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A4A75]"
      >
        Request Appointment
      </Link>
    </article>
  );
}
