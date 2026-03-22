'use client'
import Navbar from "@/components/Navbar";
import { createContext, useState } from "react";
import { useContext } from "react";

export default function FacultyLayout({ children }) {
  const [userData, setUserData] = useState(null);
  return (
    <FacultyContext.Provider value={[userData, setUserData]}>
      <div className="min-h-screen bg-[#F7F9FC]">
        <Navbar />
        <main className="pt-8 pb-16">{children}</main>
      </div>
    </FacultyContext.Provider>
  );
}