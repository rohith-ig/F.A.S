
"use client";
import { useState } from "react";
import { Bell, User } from "lucide-react";
const headingColor = "text-[#2A4A75]";
const days = ["Mon","Tue","Wed","Thu","Fri"];
const times = [
"08:00-08:50","09:00-09:50","10:00-10:50","11:00-11:50","12:00-12:50",
"01:00-01:50","02:00-02:50","03:00-03:50","04:00-04:50","05:00-05:50"
];
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
const slotMap = {
F:[["Mon","08:00-08:50"],["Tue","05:00-05:50"],["Thu","08:00-08:50"]],
H:[["Tue","08:00-08:50"],["Wed","05:00-05:50"],["Fri","08:00-08:50"]],
G:[["Wed","08:00-08:50"],["Mon","05:00-05:50"],["Thu","05:00-05:50"]],
A1:[["Mon","09:00-09:50"],["Thu","11:00-11:50"],["Fri","10:00-10:50"],["Wed","12:00-12:50"]],
B1:[["Mon","10:00-10:50"],["Tue","09:00-09:50"],["Fri","11:00-11:50"],["Thu","12:00-12:50"]],
C1:[["Mon","11:00-11:50"],["Tue","10:00-10:50"],["Fri","12:00-12:50"]],
D1:[["Tue","11:00-11:50"],["Wed","10:00-10:50"],["Thu","09:00-09:50"],["Mon","12:00-12:50"]],
E1:[["Wed","11:00-11:50"],["Thu","10:00-10:50"],["Fri","09:00-09:50"],["Tue","12:00-12:50"]],
A2:[["Mon","02:00-02:50"],["Thu","04:00-04:50"],["Fri","03:00-03:50"],["Wed","01:00-01:50"]],
B2:[["Mon","03:00-03:50"],["Tue","02:00-02:50"],["Fri","04:00-04:50"],["Thu","01:00-01:50"]],
C2:[["Mon","04:00-04:50"],["Tue","03:00-03:50"],["Wed","02:00-02:50"],["Fri","01:00-01:50"]],
D2:[["Tue","04:00-04:50"],["Wed","03:00-03:50"],["Thu","02:00-02:50"],["Mon","01:00-01:50"]],
E2:[["Wed","04:00-04:50"],["Thu","03:00-03:50"],["Fri","02:00-02:50"],["Tue","01:00-01:50"]],
P1:[["Mon","02:00-02:50"],["Mon","03:00-03:50"],["Mon","04:00-04:50"]],
Q1:[["Tue","02:00-02:50"],["Tue","03:00-03:50"],["Tue","04:00-04:50"]],
R1:[["Wed","02:00-02:50"],["Wed","03:00-03:50"],["Wed","04:00-04:50"]],
S1:[["Thu","02:00-02:50"],["Thu","03:00-03:50"],["Thu","04:00-04:50"]],
T1:[["Fri","02:00-02:50"],["Fri","03:00-03:50"],["Fri","04:00-04:50"]],
P2:[["Mon","09:00-09:50"],["Mon","10:00-10:50"],["Mon","11:00-11:50"]],
Q2:[["Tue","09:00-09:50"],["Tue","10:00-10:50"],["Tue","11:00-11:50"]],
R2:[["Wed","09:00-09:50"],["Wed","10:00-10:50"],["Wed","11:00-11:50"]],
S2:[["Thu","09:00-09:50"],["Thu","10:00-10:50"],["Thu","11:00-11:50"]],
T2:[["Fri","09:00-09:50"],["Fri","10:00-10:50"],["Fri","11:00-11:50"]],
};
export default function SetTimetable(){
const [selectedSlots,setSelectedSlots] = useState([]);
const [search,setSearch] = useState("");
const [selectedFaculty,setSelectedFaculty] = useState(null);
const [showPopup,setShowPopup] = useState(false);
/* GET ALL OCCUPIED CELLS */
const getOccupiedCells = (slots)=>{
let cells = [];
slots.forEach(slot=>{
cells.push(...slotMap[slot]);
});
return cells;
};
/* CHECK IF SLOT OVERLAPS */
const isSlotDisabled = (slot)=>{
if(selectedSlots.includes(slot)) return false;
const selectedCells = getOccupiedCells(selectedSlots);
const slotCells = slotMap[slot];
for(let [d,t] of slotCells){
for(let [sd,st] of selectedCells){
if(d===sd && t===st){
return true;
}
}
}
return false;
};
/* TOGGLE SLOT */
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
const filteredFaculty = facultyList.filter(f =>
f.toLowerCase().includes(search.toLowerCase())
);
const isColored = (day,time)=>{
for(let slot of selectedSlots){
const pos = slotMap[slot];
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
return(
<div className="min-h-screen bg-[#F7F9FC] font-sans">

{/* PAGE */}
<div className="p-8 max-w-[1100px] mx-auto">
<div className={`text-3xl font-bold mb-6 ${headingColor}`}>
Set Timetable
</div>
<div className="bg-white border border-[#E0E0E0] rounded-lg p-6 space-y-8">
{/* SELECT FACULTY */}
<div>
<div className={`text-sm font-semibold mb-3 ${headingColor}`}>
Select Faculty
</div>
<input
type="text"
placeholder="Search faculty..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border border-[#E0E0E0] rounded-md px-3 py-2 text-sm text-black outline-none focus:border-[#4A6FA5]"
/>
{search && (
<div className="border border-[#E0E0E0] rounded-md mt-2 bg-white">
{filteredFaculty.map(f=>(
<div
key={f}
onClick={()=>addFaculty(f)}
className="px-3 py-2 text-sm text-black hover:bg-[#F2F6FC] cursor-pointer"
>
{f}
</div>
))}
</div>
)}
{selectedFaculty && (
<div className="mt-4 text-sm text-black">
Selected Faculty: <span className="font-semibold">{selectedFaculty}</span>
</div>
)}
</div>
{/* SLOT SELECTOR */}
<div>
<div className={`text-sm font-semibold mb-3 ${headingColor}`}>
Select Slots
</div>
<div className="flex flex-wrap gap-2">
{Object.keys(slotMap).map(slot=>{
const disabled = isSlotDisabled(slot);
return(
<button
key={slot}
disabled={disabled}
onClick={()=>toggleSlot(slot)}
className={`px-2.5 py-0.75 text-xs rounded-md border transition
${selectedSlots.includes(slot)
?"bg-[#2A4A75] text-white border-[#2A4A75]"
:disabled
?"bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
:"border-[#E0E0E0] bg-white text-black hover:bg-[#F2F6FC]"}
`}
>
{slot}
</button>
);
})}
</div>
</div>
{/* TIMETABLE */}
<div>
<div className={`text-sm font-semibold mb-4 ${headingColor}`}>
Timetable Preview
</div>
<div className="overflow-x-auto">
<table className="w-full text-xs border border-[#E0E0E0]">
<thead className="bg-[#F7F9FC] text-black">
<tr>
<th className="border border-[#E0E0E0] p-2">Day</th>
{times.map(t=>(
<th key={t} className="border border-[#E0E0E0] p-2">
{t}
</th>
))}
</tr>
</thead>
<tbody>
{days.map(day=>(
<tr key={day}>
<td className="border border-[#E0E0E0] p-2 font-medium text-black">
{day}
</td>
{times.map(time=>(
<td
key={time}
className={`border border-[#E0E0E0] h-10
${isColored(day,time) ? "bg-[#4A6FA5]/40" : ""}
`}
></td>
))}
</tr>
))}
</tbody>
</table>
</div>
<div className="mt-6 flex gap-3">
<button
onClick={handleSetTimetable}
className="bg-[#1F3A5F] text-white px-5 py-2 rounded-md text-sm hover:bg-[#2A4A75]"
>
Set Timetable
</button>
<button
onClick={handleClearTimetable}
className="bg-white border border-[#E0E0E0] text-black px-5 py-2 rounded-md text-sm hover:bg-[#F2F6FC]"
>
Clear Timetable
</button>
</div>
</div>
</div>
</div>
{/* POPUP */}
{showPopup && (
<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
<div className="bg-white p-6 rounded-lg shadow-lg text-center">
<div className="text-lg font-semibold mb-4 text-[#2A4A75]">
Timetable is set for {selectedFaculty}
</div>
<button
onClick={handleOk}
className="bg-[#2A4A75] text-white px-4 py-2 rounded"
>
OK
</button>
</div>
</div>
)}
</div>
);
}
