"use client";

import { useEffect, useRef, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { FaGlobeEurope } from "react-icons/fa";

const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇵🇹"},
  { code: "en", label: "Englês", flag: "🇬🇧"},
  { code: "es", label: "Espanhol", flag: "🇪🇸"},
  { code: "fr", label: "Francês", flag: "🇫🇷"},
];

export default function LanguageSwitcher() {
  const cookies = parseCookies();
  const [current, setCurrent] = useState("pt");
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = cookies.googtrans?.split("/")[2];
    if (saved) setCurrent(saved); 
  }, []);
 
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current) return;
      const target = e.target as Node;
      if (!wrapperRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
 
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function changeLanguage(lang: string) {
    setCookie(null, "googtrans", `/pt/${lang}`, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    setCurrent(lang);
    setOpen(false);
    window.location.reload();
  }

  const activeLang = LANGUAGES.find((l) => l.code === current);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div id="google_translate_element" style={{ display: "none" }} />

      <button onClick={() => setOpen((v) => !v)} className="dropdown-lang">
        <FaGlobeEurope />
        <span>{activeLang?.flag}</span>
      </button>

      {open && (
        <div
          style={{ position: "absolute",  top: "120%", right: 0, background: "#fff", border: "1px solid #e5e7eb",borderRadius: "10px", 
          padding: "6px", boxShadow: "0 10px 30px rgba(0,0,0,.1)", zIndex: 99, minWidth: "120px",}}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{width: "100%", padding: "4px 10px", borderRadius: "6px", background: current === lang.code ? "#f1f5f9" : "transparent", 
              border: "none", textAlign: "left", cursor: "pointer", fontSize: "14px"}}>
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  ); 
}
