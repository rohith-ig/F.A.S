'use client'
import Navbar from "@/components/Navbar";
import { createContext, useState } from "react";
import { useContext } from "react";
import { studentContext } from "./context";

export default function StudentLayout({ children }) {
  const [userData, setUserData] = useState(null);
  return (
    <studentContext.Provider value={{ userData, setUserData }}>
      <div className="min-h-screen bg-[#F7F9FC]">
        <Navbar />
        <main className="pt-8 pb-16">{children}</main>
      </div>
    </studentContext.Provider>
  );
}