import { motion, useReducedMotion } from "framer-motion";
import { Users, LifeBuoy, CalendarClock, Database, UserPlus } from "lucide-react";

const features = [
  {
    title: "Manage User Accounts",
    desc: "Create, update, or remove Student and Faculty accounts with role control.",
    icon: Users,
    actions: ["Manage"],
  },
  {
    title: "Support Tickets",
    desc: "Review, prioritize, and resolve issues raised by users.",
    icon: LifeBuoy,
    actions: ["View Tickets"],
  },
  {
    title: "Faculty Timetable",
    desc: "Assign courses, time slots, and rooms without conflicts.",
    icon: CalendarClock,
    actions: ["Set Timetable"],
  },
  {
    title: "System Maintenance",
    desc: "Perform backups, cleanup, and view maintenance logs.",
    icon: Database,
    actions: ["Run Backup"],
  },
];

export default function AdminDashboard() {
  const reduceMotion = useReducedMotion();

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6 font-[Inter]">
      {/* Brand Header */}
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

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {features.map((f) => (
          <motion.div
            key={f.title}
            {...fadeUp}
            className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <f.icon className="h-6 w-6 text-[#2A4A75] mb-3" />
            <h2 className="text-base font-semibold text-[#1F3A5F] mb-1">
              {f.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{f.desc}</p>
            <div className="flex flex-wrap gap-2">
              {f.actions.map((a) => (
                <button
                  key={a}
                  className="text-sm px-3 py-1.5 rounded-md border border-[#4A6FA5] text-[#4A6FA5] hover:bg-[#4A6FA5]/10 transition"
                >
                  {a}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Faculty Request Card */}
      <motion.section
        {...fadeUp}
        className="bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-[#4A6FA5]/10">
            <UserPlus className="h-6 w-6 text-[#4A6FA5]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#1F3A5F] mb-1">
              Faculty Addition Request
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              A new faculty profile needs to be added to the system. Review the details and proceed with adding the faculty account.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm rounded-md bg-[#1F3A5F] text-white hover:bg-[#2A4A75] transition">
                View Request
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
