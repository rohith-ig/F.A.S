import Link from "next/link";
import { facultyProfiles } from "./facultyData";

export const metadata = {
  title: "Request Faculty Appointment",
};

export default function FacultyProfilesPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F3A5F]">Faculty Profiles</h1>
          <p className="mt-2 text-sm text-[#5A6C7D]">
            Choose a faculty member to view available appointment slots and send a request.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {facultyProfiles.map((faculty) => (
            <article
              key={faculty.id}
              className="rounded-lg border border-[#DCE3ED] bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#1F3A5F]">{faculty.name}</h2>
              <p className="mt-1 text-sm text-[#4B627B]">{faculty.department}</p>
              <p className="mt-3 text-sm text-[#5A6C7D]">
                <span className="font-medium text-[#2A4A75]">Focus:</span> {faculty.focus}
              </p>
              <p className="mt-1 text-sm text-[#5A6C7D]">
                <span className="font-medium text-[#2A4A75]">Location:</span> {faculty.location}
              </p>
              <Link
                href={`/student/req/${faculty.id}`}
                className="mt-5 inline-flex rounded-md bg-[#1F3A5F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2A4A75]"
              >
                Request Appointment
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
