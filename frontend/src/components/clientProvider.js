// components/ClientProvider.js

"use client";

import { useState } from "react";
import { Context } from "@/components/context.js";

export function ClientProvider({ children }) {
  const [userData, setUserData] = useState(null);

  return (
    <Context.Provider value={{ userData, setUserData }}>
      {children}
    </Context.Provider>
  );
}