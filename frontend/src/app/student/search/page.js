"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, Calendar } from "lucide-react";
import api from "../../../axios";

export default function SearchFaculty() {
  const [searchMode, setSearchMode] = useState("name");
  const [searchText, setSearchText] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/avail');
      
      // Deduplicate faculties from slots
      const uniqueFaculties = [];
      const seenIds = new Set();
      
      for (const slot of response.data) {
        if (slot.faculty && !seenIds.has(slot.facultyId)) {
          seenIds.add(slot.facultyId);
          uniqueFaculties.push({
            id: slot.facultyId,
            name: slot.faculty.user?.name,
            designation: slot.faculty.designation,
            department: slot.faculty.department
          });
        }
      }
      
      setFaculties(uniqueFaculties);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  const filteredFaculty = faculties.filter((f) => {
    const value = searchMode === "name" ? f.name : f.designation;
    return value?.toLowerCase().includes(searchText.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-3 text-[#5A6C7D]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3A5F]" />
          <p className="text-sm font-medium">Loading Available Faculties...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-8">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-6">
            <h1 className="text-2xl font-bold text-[#1F3A5F]">Books Appointment</h1>
            <p className="text-sm text-[#5A6C7D] mt-1">Search for faculty members with open slots to schedule a meeting.</p>
        </header>

        <section className="mb-6 flex flex-col items-stretch gap-3 rounded-xl border border-[#DCE3ED] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
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
              className={`px-4 py-2 text-sm transition ${searchMode === "name"
                  ? "bg-[#1F3A5F] text-white"
                  : "bg-white text-[#1F3A5F] hover:bg-[#F3F6FA]"
                }`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchMode("designation")}
              className={`px-4 py-2 text-sm transition ${searchMode === "designation"
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
              No available faculty found for this search.
            </p>
          ) : (
            filteredFaculty.map((faculty) => <FacultyCard key={faculty.id} {...faculty} />)
          )}
        </section>
      </section>
    </main>
  );
}

function FacultyCard({ id, name, designation, department }) {
  return (
    <article className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1F3A5F]">{name}</h3>
        </div>
        <p className="mb-1 text-sm text-[#2A4A75] font-medium">{designation}</p>
        <p className="text-xs text-[#5A6C7D]">
          <span className="font-medium text-[#1F3A5F]">Department:</span>{" "}
          {department}
        </p>
      </div>

      <Link
        href={`/student/search/${id}`}
        className="inline-flex items-center justify-center rounded-md bg-[#1F3A5F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A4A75] shadow-sm self-start md:self-center"
      >
        Request Appointment
      </Link>
    </article>
  );
}
