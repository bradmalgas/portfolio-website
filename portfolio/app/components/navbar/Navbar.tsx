"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BradLogoIcon from "../icons/BradLogoIcon";
import MenuIcon from "../icons/MenuIcon";
import CloseIcon from "../icons/CloseIcon";

const navLinks = [
  { label: "About", href: "#about", section: true },
  { label: "Projects", href: "#projects", section: true },
  { label: "Career", href: "#career", section: true },
  { label: "Contact", href: "#contact", section: true },
  { label: "Blog", href: "/blog", internal: true, section: false },
];

const CV_URL =
  "https://storageazureblogify.blob.core.windows.net/files/Bradley-Malgas-Resume.pdf";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkClass =
    "px-4 py-2 text-sm text-ink-secondary hover:text-ink rounded transition-colors duration-250";
  const mobileLinkClass =
    "px-4 py-3 text-sm text-ink-secondary hover:text-ink hover:bg-surface-overlay rounded transition-colors duration-250";
  const isBlogPage = pathname.startsWith("/blog");

  function resolveHref(href: string, isSectionLink?: boolean) {
    if (!isSectionLink) {
      return href;
    }

    return pathname === "/" ? href : `/${href}`;
  }

  function getLinkClass(href: string, isMobile = false) {
    const baseClass = isMobile ? mobileLinkClass : linkClass;
    const isBlogLink = href === "/blog";
    const isActive = isBlogLink && isBlogPage;

    return `${baseClass} ${isActive ? "text-ink md:text-accent" : ""}`;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-background/85 backdrop-blur-lg border-b border-border shadow"
          : "bg-background/85 backdrop-blur-lg border-b border-border md:bg-transparent md:backdrop-blur-none md:border-transparent md:shadow-none"
      }`}
    >
      <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={pathname === "/" ? "#home" : "/"}
          className="flex items-center gap-2.5"
          aria-label="Brad Malgas — home"
        >
          <BradLogoIcon className="h-8 w-8 text-accent" />
          <span className="font-semibold text-sm text-ink tracking-tight">
            Brad Malgas
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.internal ? (
              <Link key={link.label} href={resolveHref(link.href, link.section)} className={getLinkClass(link.href)}>
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.label}
                href={resolveHref(link.href, link.section)}
                className={getLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ),
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2.5 rounded text-ink hover:bg-surface-overlay transition-colors duration-250"
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

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out-quart ${
          isOpen
            ? "max-h-96 opacity-100 border-t border-border/50"
            : "max-h-0 opacity-0"
        } bg-surface/95 backdrop-blur-lg`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) =>
            link.internal ? (
              <Link
                key={link.label}
                href={resolveHref(link.href, link.section)}
                className={getLinkClass(link.href, true)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.label}
                href={resolveHref(link.href, link.section)}
                className={getLinkClass(link.href, true)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ),
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
