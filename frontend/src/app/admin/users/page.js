"use client";

import React, { useState } from "react";
import { useEffect } from "react";


import { Plus, Pencil, Trash2, User, Search } from "lucide-react";

export default function ManageAccountsPage() {


  const [tab, setTab] = useState("Student");
  const [search, setSearch] = useState("");

    const [users, setUsers] = useState([]);
    useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:6969/users");
    const data = await res.json();
    setUsers(data);
  };

    const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Student",
    roll: "",
    program: "",
    dept: "",
    location: "",
    subjects: "",
    });


  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);


  const filteredUsers = users
    .filter((u) => u.role === tab)
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

    // -----------------------------------------------------------------------
const handleAddUser = async () => {
  if (!newUser.name || !newUser.email) return;

  const res = await fetch("http://localhost:6969/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...newUser,
      role: tab,
    })
  });

  const data = await res.json();

  if (data.success) {
    setUsers([...users, { id: data.user.id, ...newUser, role: tab }]);
  }
};
//  ----------------------------------------------------------------------------


const handleDelete = async (id) => {

  await fetch(`http://localhost:6969/users/${id}`, {
    method: "DELETE",
  });

  setUsers(users.filter((u) => u.id !== id));
};

//-----------------------------------------------------------------------
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
    {/* Add User */}
    <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 mb-8 shadow-sm transition hover:shadow-md">

    <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">
        Add {tab}
    </h2>

    {/* STUDENT FORM */}
    {tab === "Student" && (
        <div className="grid md:grid-cols-5 gap-3">

        <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
            setNewUser({ ...newUser, name: e.target.value, role: "Student" })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Roll Number"
            value={newUser.roll}
            onChange={(e) =>
            setNewUser({ ...newUser, roll: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
            setNewUser({ ...newUser, email: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <select
            value={newUser.program}
            onChange={(e) =>
            setNewUser({ ...newUser, program: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        >
            <option value="">Program</option>
            <option>BTech</option>
            <option>MTech</option>
            <option>PhD</option>
        </select>



        </div>
    )}

    {/* FACULTY FORM */}
    {tab === "Faculty" && (
        <div className="grid md:grid-cols-2 gap-3">

        <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
            setNewUser({ ...newUser, name: e.target.value, role: "Faculty" })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
            setNewUser({ ...newUser, email: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Department"
            value={newUser.dept}
            onChange={(e) =>
            setNewUser({ ...newUser, dept: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Location"
            value={newUser.location}
            onChange={(e) =>
            setNewUser({ ...newUser, location: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        />

        <input
            placeholder="Subjects (comma separated)"
            value={newUser.subjects}
            onChange={(e) =>
            setNewUser({ ...newUser, subjects: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm md:col-span-2"
        />

        </div>
    )}

  <button
    onClick={handleAddUser}
    className="mt-4 flex items-center gap-2 bg-[#1F3A5F] text-white px-4 py-2 rounded-md text-sm hover:bg-[#2A4A75]"
  >
    <Plus size={16} />
    Add {tab}
  </button>

</div>



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

    
 {/* ----------- */}
    <tbody>

    {filteredUsers.map((user) => (
    <React.Fragment key={user.id}>


        {/* MAIN ROW */}
        <tr
        key={user.id}
        onClick={() =>
            setExpandedId(expandedId === user.id ? null : user.id)
        }
        className="border-b border-[#F1F4F9] hover:bg-[#F9FBFE] transition cursor-pointer"
        >

        {/* Name */}
        <td className="p-4 flex items-center gap-2 text-[#1F3A5F]">
            <User size={16} className="text-[#4A6FA5]" />
            {user.name}
        </td>

        {/* Roll */}
        {tab === "Student" && (
            <td className="text-[#2A4A75]">{user.roll}</td>
        )}

        {/* Email */}
        <td className="text-[#2A4A75]">{user.email}</td>

        {/* Edit */}
        <td className="text-center">
            <button
            onClick={(e) => {
                e.stopPropagation();
                handleEdit(user.id);
            }}
            className="p-2 rounded-md hover:bg-[#EEF3FA]"
            >
            <Pencil size={16} className="text-[#4A6FA5]" />
            </button>
        </td>

        {/* Delete */}
        <td className="text-center">
            <button
            onClick={(e) => {
                e.stopPropagation();
                handleDelete(user.id);
            }}
            className="p-2 rounded-md hover:bg-[#FBEAEA]"
            >
            <Trash2 size={16} className="text-red-500" />
            </button>
        </td>

        </tr>


        {/* EXPANDED DETAILS ROW */}
        {expandedId === user.id && (
        <tr className="bg-[#F9FBFE]">

            <td
            colSpan={tab === "Student" ? 5 : 4}
            className="px-6 py-4 text-sm text-[#2A4A75]"
            >

            {tab === "Student" && (
                <div className="flex gap-10">
                <div>
                    <span className="font-medium">Program:</span> {user.program || "-"}
                </div>
                </div>
            )}

            {tab === "Faculty" && (
                <div className="flex flex-col gap-2">

                <div>
                    <span className="font-medium">Department:</span> {user.dept || "-"}
                </div>

                <div>
                    <span className="font-medium">Location:</span> {user.location || "-"}
                </div>

                <div>
                    <span className="font-medium">Subjects:</span> {user.subjects || "-"}
                </div>

                </div>
            )}

            </td>

        </tr>
        )}

    </React.Fragment>

    ))}

    </tbody>


    {/* ----------------------- */}


  </table>

</div>


        </div>

      </div>

    </main>
  );
}
