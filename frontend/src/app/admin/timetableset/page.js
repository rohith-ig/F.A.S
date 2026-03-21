"use client";
import { useState } from "react";

const headingColor = "text-[#2A4A75]";

const days = ["Mon","Tue","Wed","Thu","Fri"];

const times = [
"08:00-08:50","09:00-09:50","10:00-10:50","11:00-11:50","12:00-12:50",
"01:00-01:50","02:00-02:50","03:00-03:50","04:00-04:50","05:00-05:50"
];

const slotMap = {
F:[["Mon","08:00-08:50"],["Tue","05:00-05:50"],["Thu","08:00-08:50"]],
H:[["Tue","08:00-08:50"],["Wed","05:00-05:50"],["Fri","08:00-08:50"]],
G:[["Wed","08:00-08:50"],["Mon","05:00-05:50"],["Thu","05:00-05:50"]],
A1:[["Mon","09:00-09:50"],["Thu","11:00-11:50"],["Fri","10:00-10:50"],["Wed","12:00-12:50"]],
A2:[["Mon","02:00-02:50"],["Thu","04:00-04:50"],["Fri","03:00-03:50"],["Wed","01:00-01:50"]],
};

export default function SetTimetable(){

const [selectedSlots,setSelectedSlots] = useState([]);
const [search,setSearch] = useState("");
const [selectedFaculty,setSelectedFaculty] = useState(null);
const [showPopup,setShowPopup] = useState(false);
const [uploadStatus,setUploadStatus] = useState("");
const [manualUploadStatus, setManualUploadStatus] = useState(""); 

/* ================= CSV UPLOAD ================= */

const handleCSVUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target.result;

    const lines = text.split("\n").filter(line => line.trim() !== "");

    const dataLines = lines.slice(1); // skip header

    const parsedData = dataLines.map(line => {
      const [faculty_name, slots] = line.split(/,(.+)/);

      return {
        faculty: faculty_name.trim(),
        slots: slots.replace(/"/g, "").split(",").map(s => s.trim())
      };
    });

    uploadCSVData(parsedData);
  };

  reader.readAsText(file);
};



const uploadCSVData = async (data) => {
  try {
    const res = await fetch("http://localhost:6969/api/admin/upload-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    });

    const result = await res.json();
    setUploadStatus(result.message);

  } catch (err) {
    console.error(err);
    setUploadStatus("Upload failed");
  }
};

/* ================= MANUAL SLOT UPLOAD ================= */
const handleManualUpload = async () => {
  if (!selectedFaculty || selectedSlots.length === 0) return;

  try {
    const res = await fetch("http://localhost:6969/api/admin/upload-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        faculty: selectedFaculty,
        slots: selectedSlots
      })
    });

    const result = await res.json();

    if (res.ok) {
      setManualUploadStatus("Upload successful!"); // ✅ This triggers UI update
      setSelectedSlots([]); // clear slots
      setSelectedFaculty(null); // optional
    } else {
      setManualUploadStatus(result.message || "Upload failed");
    }
  } catch (err) {
    console.error(err);
    setManualUploadStatus("Upload failed");
  }
};
/* ================= EXISTING LOGIC ================= */

const getOccupiedCells = (slots)=>{
let cells = [];
slots.forEach(slot=>{
if(slotMap[slot]){
cells.push(...slotMap[slot]);
}
});
return cells;
};

const isSlotDisabled = (slot)=>{
if(selectedSlots.includes(slot)) return false;

const selectedCells = getOccupiedCells(selectedSlots);
const slotCells = slotMap[slot] || [];

for(let [d,t] of slotCells){
for(let [sd,st] of selectedCells){
if(d===sd && t===st){
return true;
}
}
}
return false;
};

const toggleSlot = (slot)=>{
if(isSlotDisabled(slot)) return;

if(selectedSlots.includes(slot)){
setSelectedSlots(selectedSlots.filter(s=>s!==slot));
}else{
setSelectedSlots([...selectedSlots,slot]);
}
};

const addFaculty = (name)=>{
setSelectedFaculty(name);
setSearch("");
};

const facultyList = [
"Dr. Ananya Nair",
"Dr. Rahul Menon",
"Dr. Priya Varma",
"Dr. Arjun Pillai",
"Dr. Meera Thomas",
"Dr. Kiran Joseph",
"Dr. Neha Ramesh",
"Dr. Aditya Sharma"
];

const filteredFaculty = facultyList.filter(f =>
f.toLowerCase().includes(search.toLowerCase())
);

const isColored = (day,time)=>{
for(let slot of selectedSlots){
const pos = slotMap[slot] || [];
for(let [d,t] of pos){
if(d===day && t===time) return true;
}
}
return false;
};

const handleSetTimetable = ()=>{
if(!selectedFaculty) return;
setShowPopup(true);
};

const handleOk = ()=>{
setShowPopup(false);
setSelectedSlots([]);
};

const handleClearTimetable = ()=>{
setSelectedSlots([]);
};

/* ================= UI ================= */

return(
<div className="min-h-screen bg-[#F4F7FB] font-sans flex justify-center items-start py-10">

<div className="w-full max-w-[1200px]">

<div className={`text-4xl font-bold mb-8 ${headingColor}`}>
Set Timetable
</div>

{/* CSV UPLOAD */}
<div className="mb-8 bg-white p-6 rounded-xl shadow-sm border">

<div className="text-lg font-semibold mb-3">Upload CSV</div>

<label className="inline-block cursor-pointer">
  <span className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#2A4A75] to-[#4A6FA5] hover:opacity-90 transition">
    Choose CSV File
  </span>
  <input 
    type="file" 
    accept=".csv" 
    onChange={handleCSVUpload}
    className="hidden"
  />
</label>

{uploadStatus && (
<div className="mt-3 text-sm text-green-600 font-medium">
  {uploadStatus}
</div>
)}

</div>

<div className="bg-white border border-[#E0E0E0] rounded-xl p-8 space-y-8 shadow-sm">

{/* SELECT FACULTY */}
<div>
<div className={`text-lg font-semibold mb-3 ${headingColor}`}>
Select Faculty
</div>

<input
type="text"
placeholder="Search faculty..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A6FA5]"
/>

{search && (
<div className="border mt-2 rounded-lg bg-white shadow-sm max-h-40 overflow-y-auto">
{filteredFaculty.map(f=>(
<div 
key={f} 
onClick={()=>addFaculty(f)} 
className="px-4 py-2 cursor-pointer hover:bg-[#F2F6FC]"
>
{f}
</div>
))}
</div>
)}

{selectedFaculty && (
<div className="mt-3 text-sm">
Selected: <span className="font-semibold">{selectedFaculty}</span>
</div>
)}

</div>

{/* SLOT SELECTOR */}
<div>
<div className="text-lg font-semibold mb-3">Select Slots</div>

<div className="flex flex-wrap gap-3">
{Object.keys(slotMap).map(slot=>(
<button
key={slot}
onClick={()=>toggleSlot(slot)}
disabled={isSlotDisabled(slot)}
className={`px-3 py-1.5 rounded-md border text-sm transition
${selectedSlots.includes(slot)
  ? "bg-[#2A4A75] text-white border-[#2A4A75]"
  : isSlotDisabled(slot)
  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
  : "bg-white hover:bg-[#F2F6FC]"
}`}
>
{slot}
</button>
))}
</div>
</div>

{/* TIMETABLE */}
<div>
<div className="text-lg font-semibold mb-4">Timetable Preview</div>

<div className="overflow-x-auto">
<table className="w-full border border-gray-300 text-sm">

<thead className="bg-[#EAF0F8]">
<tr>
<th className="border p-3 w-24">Day</th>
{times.map(t=>(
<th key={t} className="border p-3 min-w-[100px] text-center">
{t}
</th>
))}
</tr>
</thead>

<tbody>
{days.map(day=>(
<tr key={day} className="text-center">
<td className="border p-3 font-semibold bg-[#F7F9FC]">
{day}
</td>

{times.map(time=>(
<td
key={time}
className={`border h-12 transition
${isColored(day,time) ? "bg-[#4A6FA5]/40" : "hover:bg-[#F2F6FC]"}
`}
></td>
))}
</tr>
))}
</tbody>

</table>
<div className="mt-4 flex gap-3">
  <button
    onClick={handleManualUpload}
    className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#2A4A75] to-[#4A6FA5] hover:opacity-90 transition"
  >
    Save Selected Slots
  </button>

  <button
    onClick={handleClearTimetable}
    className="px-6 py-3 rounded-lg text-[#2A4A75] border border-[#2A4A75] hover:bg-[#F2F6FC] transition"
  >
    Clear Selection
  </button>
</div>
{/* ✅ Manual upload success message */}
{manualUploadStatus && (
  <div className="mt-2 text-sm text-green-600 font-medium">
    {manualUploadStatus}
  </div>
)}
</div>

</div>

</div>
</div>
</div>
);
}