"use client";
import { useState, useEffect } from "react";
import ArrowUp from "../icons/ArrowUp";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 right-5 rounded-full bg-black shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-90" : "opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-12 w-12" fillColour="#ffffff" />
    </button>
  );
}
