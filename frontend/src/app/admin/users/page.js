"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, User, Search } from "lucide-react";

export default function ManageAccountsPage() {
  const [tab, setTab] = useState("Student");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Janhvi Halder",
      email: "janhvi@student.edu",
      role: "Student",
      roll: "CS21012",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@student.edu",
      role: "Student",
      roll: "CS21015",
    },
    {
      id: 3,
      name: "Dr. Mehta",
      email: "mehta@faculty.edu",
      role: "Faculty",
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Faculty",
  });

  const [editingId, setEditingId] = useState(null);

  const filteredUsers = users
    .filter((u) => u.role === tab)
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;

    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ name: "", email: "", role: "Faculty" });
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleChange = (id, field, value) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, [field]: value } : u
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-10 flex justify-center font-[Inter]">

      <div className="w-full max-w-6xl animate-[fadeUp_.4s_ease]">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-semibold text-[#1F3A5F] tracking-tight">
            Manage Accounts
          </h1>

          <p className="text-sm text-[#4A6FA5] mt-1">
            View, update, and manage student and faculty profiles.
          </p>
        </div>


        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          {/* Toggle */}
          <div className="flex bg-white border border-[#E0E0E0] rounded-md p-[3px] w-fit shadow-sm">

            <button
              onClick={() => setTab("Student")}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                tab === "Student"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#2A4A75] hover:bg-[#F1F4F9]"
              }`}
            >
              Students
            </button>

            <button
              onClick={() => setTab("Faculty")}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                tab === "Faculty"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#2A4A75] hover:bg-[#F1F4F9]"
              }`}
            >
              Faculty
            </button>

          </div>


          {/* Search */}
          <div className="relative w-full md:w-72">

            <Search
              size={16}
              className="absolute left-3 top-3 text-[#8FA3BF]"
            />

            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-md pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4A6FA5]"
            />

          </div>

        </div>


        {/* Add Faculty */}
        {tab === "Faculty" && (
          <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 mb-8 shadow-sm transition hover:shadow-md">

            <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">
              Add Faculty
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4A6FA5]"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4A6FA5]"
              />

            </div>

            <button
              onClick={handleAddUser}
              className="mt-4 flex items-center gap-2 bg-[#1F3A5F] text-white px-4 py-2 rounded-md text-sm transition hover:bg-[#2A4A75]"
            >
              <Plus size={16} />
              Add Faculty
            </button>

          </div>
        )}


        {/* Table Card */}
        <div className="bg-white border border-[#E0E0E0] rounded-lg shadow-sm overflow-hidden">

 {/* Table Card */}
<div className="bg-white border border-[#E0E0E0] rounded-lg shadow-sm overflow-hidden">

  <table className="w-full text-sm">

    <thead className="bg-[#F7F9FC] border-b border-[#E0E0E0] text-[#2A4A75]">
      <tr>

        <th className="text-left p-4 font-medium">User</th>

        {tab === "Student" && (
          <th className="text-left font-medium">Roll Number</th>
        )}

        <th className="text-left font-medium">Email</th>

        <th className="text-center font-medium w-[90px]">Edit</th>
        <th className="text-center font-medium w-[90px]">Delete</th>

      </tr>
    </thead>

    <tbody>

      {filteredUsers.map((user) => (
        <tr
          key={user.id}
          className="border-b border-[#F1F4F9] hover:bg-[#F9FBFE] transition"
        >

          {/* Name */}
          <td className="p-4 flex items-center gap-2 text-[#1F3A5F]">
            <User size={16} className="text-[#4A6FA5]" />

            {editingId === user.id ? (
              <input
                value={user.name}
                onChange={(e) =>
                  handleChange(user.id, "name", e.target.value)
                }
                className="border border-[#E0E0E0] px-2 py-1 rounded text-sm"
              />
            ) : (
              user.name
            )}

          </td>


          {/* Roll Number */}
          {tab === "Student" && (
            <td className="text-[#2A4A75]">{user.roll}</td>
          )}


          {/* Email */}
          <td className="text-[#2A4A75]">

            {editingId === user.id ? (
              <input
                value={user.email}
                onChange={(e) =>
                  handleChange(user.id, "email", e.target.value)
                }
                className="border border-[#E0E0E0] px-2 py-1 rounded text-sm"
              />
            ) : (
              user.email
            )}

          </td>


          {/* Edit Column */}
          <td className="text-center">

            {editingId === user.id ? (
              <button
                onClick={handleSave}
                className="text-sm font-medium text-[#1F3A5F] hover:text-[#4A6FA5]"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => handleEdit(user.id)}
                className="p-2 rounded-md hover:bg-[#EEF3FA] transition"
              >
                <Pencil size={16} className="text-[#4A6FA5]" />
              </button>
            )}

          </td>


          {/* Delete Column */}
          <td className="text-center">

            <button
              onClick={() => handleDelete(user.id)}
              className="p-2 rounded-md hover:bg-[#FBEAEA] transition"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>

          </td>

        </tr>
      ))}

    </tbody>

  </table>

</div>


        </div>

      </div>

    </main>
  );
}
