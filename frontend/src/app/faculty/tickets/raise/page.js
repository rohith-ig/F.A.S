import RaiseTicketForm from "@/components/RaiseTicketForm";

export default function StudentRaiseTicketPage() {

  // Example values (replace with session / auth data)
  const studentName = "Janhvi Halder";
  const studentEmail = "janhvi@student.edu";

  return (
    <main className="min-h-screen bg-[#F7F9FC] flex justify-center px-6 py-12">

      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1F3A5F]">
            Raise Support Ticket
          </h1>
        </div>


        {/* Student Info */}
        <div className="border border-[#E0E0E0] rounded-lg bg-white p-6 mb-8 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

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

        </div>


        {/* Ticket Form */}
        <div className="border border-[#E0E0E0] rounded-lg bg-white p-6 shadow-sm">
          <RaiseTicketForm role="Student" />
        </div>

      </div>

    </main>
  );
}
