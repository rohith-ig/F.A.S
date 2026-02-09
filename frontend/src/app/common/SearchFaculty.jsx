import { useState } from "react";
import { Search } from "lucide-react";

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
  const value =
    searchMode === "name" ? f.name : f.role;

  return value.toLowerCase().includes(searchText.toLowerCase());
});

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#1F3A5F] flex items-center justify-center text-white font-semibold">
            FS
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#1F3A5F]">
              Faculty Scheduler
            </h1>
            <p className="text-sm text-[#2A4A75]">
              Academic scheduling made simple
            </p>
          </div>
        </header>

        {/* Title */}
        <section className="mb-6">
          <h2 className="text-3xl font-semibold text-[#1F3A5F] mb-2">
            Search Faculty
          </h2>
          <p className="text-[#2A4A75]">
            Locate faculty members and view the courses they teach.
          </p>
        </section>

        {/* Search Bar + Mode Selector */}
        <section className="bg-white border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6FA5]" />
<input
  type="text"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder={
    searchMode === "name"
      ? "Search by faculty name"
      : "Search by designation"
  }
className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]/30"
/>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-[#F7F9FC] border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setSearchMode("name")}
              className={`px-4 py-2 text-sm transition-all duration-300 ${
                searchMode === "name"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#1F3A5F] hover:bg-[#4A6FA5]/10"
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchMode("designation")}
              className={`px-4 py-2 text-sm transition-all duration-300 ${
                searchMode === "designation"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#1F3A5F] hover:bg-[#4A6FA5]/10"
              }`}
            >
              Designation
            </button>
          </div>
        </section>

        {/* Results */}
        <section className="grid gap-4">
<section className="grid gap-4">
  {filteredFaculty.length === 0 ? (
    <p className="text-sm text-gray-500">No results found</p>
  ) : (
    filteredFaculty.map((faculty) => (
      <FacultyCard key={faculty.name} {...faculty} />
    ))
  )}
</section>
        </section>
      </div>
    </div>
  );
}

function FacultyCard({ name, role, status, courses, location, color }) {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-[#1F3A5F]">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${colorMap[color]}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-[#2A4A75] mb-1">{role}</p>

      <p className="text-xs text-gray-600 mb-1">
        <span className="font-medium text-[#1F3A5F]">Courses:</span>{" "}
        {courses}
      </p>

      <p className="text-xs text-gray-600">
        <span className="font-medium text-[#1F3A5F]">Location:</span>{" "}
        {location}
      </p>
    </div>
  );
}
