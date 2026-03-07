"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BradLogoIcon from "../icons/BradLogoIcon";
import MenuIcon from "../icons/MenuIcon";
import CloseIcon from "../icons/CloseIcon";

const navLinks = [
  { label: "Home", href: "/", external: false },
  { label: "Projects", href: "/projects", external: false },
  { label: "Blog", href: "https://blog.bradmalgas.com", external: true },
];

const CV_URL =
  "https://storageazureblogify.blob.core.windows.net/files/Bradley Malgas Resume.pdf";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border shadow"
          : "bg-background/85 backdrop-blur-lg border-b border-border md:bg-transparent md:backdrop-blur-none md:border-transparent md:shadow-none"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Brad Malgas — home"
        >
          <BradLogoIcon
            className="h-8 w-8"
            fillColour="#7C6EFF"
          />
          <span className="font-semibold text-sm text-ink tracking-tight">
            Brad Malgas
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm text-ink-secondary hover:text-ink rounded transition-colors duration-250"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-ink-secondary hover:text-ink rounded transition-colors duration-250"
              >
                {link.label}
              </Link>
            )
          )}

          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 btn-ghost text-sm"
          >
            Download CV
          </a>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 rounded text-ink hover:bg-surface-overlay transition-colors duration-250"
          onMouseDown={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-350 ease-out-expo ${
          isOpen
            ? "max-h-72 opacity-100 border-t border-border/50"
            : "max-h-0 opacity-0"
        } bg-surface/95 backdrop-blur-lg`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm text-ink-secondary hover:text-ink hover:bg-surface-overlay rounded transition-colors duration-250"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-sm text-ink-secondary hover:text-ink hover:bg-surface-overlay rounded transition-colors duration-250"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}

          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 btn-ghost text-sm text-center"
            onClick={() => setIsOpen(false)}
          >
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
