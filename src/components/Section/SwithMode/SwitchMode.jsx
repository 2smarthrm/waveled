"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site-version-mode";
const VERSION_1_CLASS = "version-1-page";
const VERSION_2_CLASS = "version-2-page";

export default function SwitchMode() {
  const [mode, setMode] = useState("version-1");   
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "version-1" || saved === "version-2") {
      setMode(saved);
    }
  }, []);

  // Aplicar classe ao body + guardar em localStorage + (opcional) cookies
  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;

    // Remove sempre as duas para garantir que só há uma activa
    body.classList.remove(VERSION_1_CLASS, VERSION_2_CLASS);

    if (mode === "version-1") {
      body.classList.add(VERSION_1_CLASS);
    } else if (mode === "version-2") {
      body.classList.add(VERSION_2_CLASS);
    }

    // Guardar em localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
 
  }, [mode]);

  const handleSetVersion = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        zIndex: 9999,
      }}
    >
     
    </div>
  );
}
