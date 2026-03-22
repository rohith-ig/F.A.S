"use client";

import React, { useState } from "react";
import { useEffect } from "react";


import { Plus, Pencil, Trash2, User, Search } from "lucide-react";

export default function ManageAccountsPage() {

  const getTokenFromCookie = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
  };

  const [tab, setTab] = useState("STUDENT");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
    useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => { 
  try {
    const token = getTokenFromCookie(); 
    if (!token) return console.error("No token found, please log in!");

    const res = await fetch("http://localhost:6969/api/users", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }); 
    
    const data = await res.json(); 
    
    // Safety check to prevent the "users.filter is not a function" error
    if (Array.isArray(data)) {
      setUsers(data); 
    } else {
      console.error("Error fetching users:", data);
      setUsers([]); 
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setUsers([]);
  }
};

    const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "STUDENT",
    roll: "",
    program: "",
    dept: "",
    location: "",
    subjects: "",
    designation1:"",
    });


  const [editingUser, setEditingUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null);


  const filteredUsers = users
    .filter((u) => u.role === tab)
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

    // -----------------------------------------------------------------------
const handleAddUser = async () => {
  if (!newUser.name || !newUser.email) return;
  const token = getTokenFromCookie(); 
  const res = await fetch("http://localhost:6969/api/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      ...newUser,
      role: tab,
    })
  });

  const data = await res.json();

  if (data.success) {
    setUsers([...users, data.user]);

  }
};
//  ----------------------------------------------------------------------------


const handleDelete = async (id) => {
  const token = getTokenFromCookie();
  await fetch(`http://localhost:6969/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}` // Added the token header
    },
  });

  setUsers(users.filter((u) => u.id !== id));
};


const handleCSVUpload = async (e) => { 
  const file = e.target.files[0]; 
  if (!file) return;

  const token = getTokenFromCookie();
  const formData = new FormData(); 
  formData.append("file", file);

  const res = await fetch("http://localhost:6969/api/users/bulk-upload", { 
    method: "POST", 
    headers: { Authorization: `Bearer ${token}` }, 
    body: formData, 
  });
  
  const data = await res.json();
  
  if (data.success) { 
    alert("Users uploaded successfully"); 
    fetchUsers(); 
  } else {
    // Add an alert so you know if the backend rejected it!
    alert("Failed to upload: " + data.error);
  }

  // ADD THIS LINE to reset the file input!
  e.target.value = null; 
};



//-----------------------------------------------------------------------
const handleEditSubmit = async (e) => {
  e.preventDefault();
  const token = getTokenFromCookie();

  const res = await fetch(`http://localhost:6969/api/users/update-user/${editingUser.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    // Map your editingUser state to the fields the backend expects
    body: JSON.stringify({
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      roll: editingUser.studentProfile?.rollNumber,
      dept: editingUser.studentProfile?.department || editingUser.facultyProfile?.department,
      program: editingUser.studentProfile?.designation,
      designation1: editingUser.facultyProfile?.designation
    })
  });

  const data = await res.json();
  if (data.success) {
    alert("User updated successfully!");
    setEditingUser(null); // Close the modal/form
    fetchUsers(); // Refresh the table to show updated data
  } else {
    alert("Failed to update user.");
  }
};

//------------------------------------------------------------------------------------

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
// --------------------------------------------------------------------------
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
              onClick={() => {
                setTab("STUDENT"); 
                setExpandedId(null); 
                setNewUser({
                name: "",
                email: "",
                role: "STUDENT",
                roll: "",
                program: "",   //student program
                dept: "",
                location: "",
                subjects: "",
                designation1: "",   //faculty designation
                });
              }}
              
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                tab === "STUDENT"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#2A4A75] hover:bg-[#F1F4F9]"
              }`}
            >
              Students
            </button>

            <button
              onClick={() => {
                setTab("FACULTY"); 
                setExpandedId(null); 
                setNewUser({
                  name: "",
                  email: "",
                  role: "FACULTY",
                  roll: "",
                  program: "",
                  dept: "",
                  location: "",
                  subjects: "",
                  designation1: "",
                });

              }}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                tab === "FACULTY"
                  ? "bg-[#1F3A5F] text-white"
                  : "text-[#2A4A75] hover:bg-[#F1F4F9]"
              }`}
            >
              Faculty
            </button>

          </div>

          {/* CSV Upload Button */}
          <div className="relative w-full md:w-72 flex justify-center md:justify-center">


            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csvUpload"
            />

            <label
              htmlFor="csvUpload"
              className="cursor-pointer inline-flex items-center justify-center w-full border border-[#E0E0E0] rounded-md px-4 py-2 text-sm bg-white hover:bg-[#F1F4F9] text-[#2A4A75] transition"
            >
              Upload CSV
            </label>

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


     
    {/* Add User */}
    <div className="bg-white border border-[#E0E0E0] rounded-lg p-6 mb-8 shadow-sm transition hover:shadow-md">

    {/* <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">
        Add {tab}
    </h2> */}

    {/* STUDENT FORM */}
    {tab === "STUDENT" && (
        <div className="grid md:grid-cols-2 gap-3">


        <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
            setNewUser({ ...newUser, name: e.target.value, role: "STUDENT" })
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
            <option>B.Tech.</option>
            <option>M.Tech.</option>
            <option>Ph.D.</option>
        </select>

        <select
            value={newUser.dept}
            onChange={(e) =>
            setNewUser({ ...newUser, dept: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        >
            <option value="">Department</option>
            <option>AR</option>
            <option>BT</option>
            <option>CE</option>
            <option>CH</option>
            <option>CS</option>
            <option>EC</option>
            <option>EE</option>
            <option>EP</option>
            <option>ME</option>
            <option>MT</option>
            <option>PE</option>
        </select>

        </div>
    )}

    {/* FACULTY FORM */}
    {tab === "FACULTY" && (
        <div className="grid md:grid-cols-2 gap-3">

        <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
            setNewUser({ ...newUser, name: e.target.value, role: "FACULTY" })
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
            value={newUser.dept}
            onChange={(e) =>
            setNewUser({ ...newUser, dept: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        >
            <option value="">Department</option>
            <option>AR</option>
            <option>BT</option>
            <option>CE</option>
            <option>CH</option>
            <option>CS</option>
            <option>EC</option>
            <option>EE</option>
            <option>EP</option>
            <option>ME</option>
            <option>MT</option>
            <option>PE</option>
        </select>


        <select
            value={newUser.designation1}
            onChange={(e) =>
            setNewUser({ ...newUser, designation1: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        >
            <option value="">Designation</option>
            <option>Professor</option>
            <option>Associate Professor</option>
            <option>Assistant Professor</option>
        </select>

        {/* <input
            placeholder="Location"
            value={newUser.location}
            onChange={(e) =>
            setNewUser({ ...newUser, location: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm"
        /> */}

        {/* <input
            placeholder="Subjects (comma separated)"
            value={newUser.subjects}
            onChange={(e) =>
            setNewUser({ ...newUser, subjects: e.target.value })
            }
            className="border border-[#E0E0E0] rounded-md px-3 py-2 text-sm md:col-span-2"
        /> */}

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

        {tab === "STUDENT" && (
          <th className="text-left font-medium">Roll Number</th>
        )}
        

        <th className="text-left font-medium">Email</th>

        {tab === "STUDENT" && (
          <th className="text-left font-medium">Program</th>
        )}

        {/* {tab === "STUDENT" && (
          <th className="text-left font-medium">Department</th>
        )} */}
        <th className="text-left font-medium">Department</th>
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
          onClick={() => {
            if (tab === "FACULTY") {
              setExpandedId(expandedId === user.id ? null : user.id);
            }
          }}
          >

        {/* Name */}
        <td className="p-4 flex items-center gap-2 text-[#1F3A5F]">
            <User size={16} className="text-[#4A6FA5]" />
            {user.name}
        </td>

        {/* Roll */}
        {tab === "STUDENT" && (
            <td className="text-[#2A4A75]">{user.studentProfile?.rollNumber}</td>
        )}

        {/* Email */}
        <td className="text-[#2A4A75]">{user.email}</td>

        {tab === "STUDENT" && (
            <td className="text-[#2A4A75]">{user.studentProfile?.designation}</td>
        )}

        <td className="text-[#2A4A75]">
          {user.studentProfile?.department || user.facultyProfile?.department}
        </td>



        {/* Edit */}
        <td className="text-center">
            <button
            onClick={(e) => {
                e.stopPropagation();
                setEditingUser(user);
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
        {tab==="FACULTY" && expandedId === user.id && (
        <tr className="bg-[#F9FBFE]">

            <td
            colSpan={tab === "STUDENT" ? 5 : 4}
            className="px-6 py-4 text-sm text-[#2A4A75]"
            >


            {tab === "FACULTY" && (
                <div className="flex flex-col gap-2">


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
   {editingUser && (
        <div className="fixed inset-0 bg-[#1F3A5F]/10 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4">Edit User</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  required
                  value={editingUser.name || ""} 
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  required
                  value={editingUser.email || ""} 
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  value={editingUser.role || "STUDENT"} 
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                </select>
              </div>

              {/* Conditional STUDENT Fields */}
              {editingUser.role === "STUDENT" && (
                <div className="space-y-4 p-4 bg-gray-50 border rounded-md mt-2">
                  <input 
                    type="text" 
                    placeholder="Roll Number"
                    value={editingUser.studentProfile?.rollNumber || ""} 
                    onChange={(e) => setEditingUser({ 
                      ...editingUser, 
                      studentProfile: { ...editingUser.studentProfile, rollNumber: e.target.value } 
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Department (e.g., CS)"
                    value={editingUser.studentProfile?.department || ""} 
                    onChange={(e) => setEditingUser({ 
                      ...editingUser, 
                      studentProfile: { ...editingUser.studentProfile, department: e.target.value } 
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Program (e.g., B.Tech.)"
                    value={editingUser.studentProfile?.designation || ""} 
                    onChange={(e) => setEditingUser({ 
                      ...editingUser, 
                      studentProfile: { ...editingUser.studentProfile, designation: e.target.value } 
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              )}

              {/* Conditional FACULTY Fields */}
              {editingUser.role === "FACULTY" && (
                <div className="space-y-4 p-4 bg-gray-50 border rounded-md mt-2">
                  <input 
                    type="text" 
                    placeholder="Department (e.g., CS)"
                    value={editingUser.facultyProfile?.department || ""} 
                    onChange={(e) => setEditingUser({ 
                      ...editingUser, 
                      facultyProfile: { ...editingUser.facultyProfile, department: e.target.value } 
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Designation (e.g., Professor)"
                    value={editingUser.facultyProfile?.designation || ""} 
                    onChange={(e) => setEditingUser({ 
                      ...editingUser, 
                      facultyProfile: { ...editingUser.facultyProfile, designation: e.target.value } 
                    })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} // Closes the modal
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm bg-[#1F3A5F] text-white rounded-md hover:bg-[#152842]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

    </main>
  );
}
