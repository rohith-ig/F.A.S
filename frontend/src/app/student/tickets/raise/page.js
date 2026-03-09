import RaiseTicketForm from "@/components/RaiseTicketForm";

export default function StudentRaiseTicketPage() {

  // Example values (replace with session / auth data)
  const studentName = "Janhvi Halder";
  const studentEmail = "janhvi@student.edu";

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-10">

      <div className="mx-auto max-w-3xl">


        {/* Header */}
        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-semibold text-[#1F3A5F]">
            Raise Support Ticket
          </h1>

          <p className="mt-2 text-sm text-[#4A6FA5]">
            Report issues related to appointments, scheduling, or system usage.
          </p>
        </div>

        {/* Student Info */}
        <div className="grid gap-4 md:grid-cols-2 border border-[#E0E0E0] rounded-lg bg-white p-5 mb-6">

          <div>
            <label className="block text-xs font-medium text-[#2A4A75] mb-1">
              Client
            </label>
            <input
              type="text"
              value={studentName}
              readOnly
              className="w-full rounded-md border border-[#E0E0E0] bg-[#F7F9FC] px-3 py-2 text-sm text-[#1F3A5F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2A4A75] mb-1">
              Email
            </label>
            <input
              type="email"
              value={studentEmail}
              readOnly
              className="w-full rounded-md border border-[#E0E0E0] bg-[#F7F9FC] px-3 py-2 text-sm text-[#1F3A5F]"
            />
          </div>

        </div>

        {/* Ticket Form */}
        <div className="border-t border-[#E0E0E0] pt-6">
          <RaiseTicketForm role="Student" />
        </div>

      </div>

    </main>
  );
}
