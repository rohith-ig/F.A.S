import { Users, LifeBuoy, CalendarClock, Database, UserPlus } from "lucide-react";

const features = [
  {
    title: "Manage User Accounts",
    desc: "Create, update, or remove Student and Faculty accounts with role control.",
    icon: Users,
    action: "Manage",
  },
  {
    title: "Support Tickets",
    desc: "Review, prioritize, and resolve issues raised by users.",
    icon: LifeBuoy,
    action: "View Tickets",
  },
  {
    title: "Faculty Timetable",
    desc: "Assign courses, time slots, and rooms without conflicts.",
    icon: CalendarClock,
    action: "Set Timetable",
  },
  {
    title: "System Maintenance",
    desc: "Perform backups to ensure system reliability.",
    icon: Database,
    action: "Run Backup",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6 font-[Inter]">
      {/* Header */}
      <header className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-[#1F3A5F] text-white flex items-center justify-center font-semibold">
          FS
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1F3A5F]">
            Faculty Scheduler
          </h1>
          <p className="text-sm text-gray-600">
            Admin Dashboard – manage schedules, users, and system health
          </p>
        </div>
      </header>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm"
          >
            <f.icon className="h-6 w-6 text-[#2A4A75] mb-3" />
            <h2 className="text-base font-semibold text-[#1F3A5F] mb-1">
              {f.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{f.desc}</p>
            <button className="text-sm px-4 py-2 rounded-md border border-[#4A6FA5] text-[#4A6FA5] hover:bg-[#4A6FA5]/10">
              {f.action}
            </button>
          </div>
        ))}
      </section>

      {/* Faculty Addition Request */}
      <section className="bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#4A6FA5]/10">
            <UserPlus className="h-6 w-6 text-[#4A6FA5]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1F3A5F] mb-1">
              Faculty Addition Request
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              A faculty profile needs to be added to the system. Review the
              details before creating the account.
            </p>
            <button className="px-4 py-2 text-sm rounded-md bg-[#1F3A5F] text-white hover:bg-[#2A4A75]">
              View Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
