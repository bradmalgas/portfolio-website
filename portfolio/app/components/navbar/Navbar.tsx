"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BradLogoIcon from "../icons/BradLogoIcon";
import MenuIcon from "../icons/MenuIcon";
import CloseIcon from "../icons/CloseIcon";
import ThemeToggle from "../theme/ThemeToggle";

const navLinks = [
  { label: "About", href: "#about", section: true },
  { label: "Projects", href: "#projects", section: true },
  { label: "Career", href: "#career", section: true },
  { label: "Contact", href: "#contact", section: true },
  { label: "Blog", href: "/blog", internal: true, section: false },
];
const sectionIds = navLinks
  .filter((link) => link.section)
  .map((link) => link.href.slice(1));

const CV_URL =
    "https://storageazureblogify.blob.core.windows.net/files/Brad-Malgas-Resume.pdf";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const nextScrolled = window.scrollY > 20;
        setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    let frame: number | null = null;
    const retryTimers: number[] = [];

    const updateActiveSection = () => {
      frame = null;
      const navOffset = 96;
      const sections = sectionIds
        .map((sectionId) => ({
          id: sectionId,
          top: document.getElementById(sectionId)?.getBoundingClientRect().top,
        }))
        .filter((section): section is { id: string; top: number } =>
          typeof section.top === "number",
        );

      const currentSection = sections.reduce<string | null>((current, section) => {
        if (section.top - navOffset <= 0) {
          return section.id;
        }

        return current;
      }, null);

      setActiveSection((current) =>
        current === currentSection ? current : currentSection,
      );
    };

    const scheduleUpdate = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    retryTimers.push(window.setTimeout(scheduleUpdate, 150));
    retryTimers.push(window.setTimeout(scheduleUpdate, 600));
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      retryTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [pathname]);

  const linkClass =
    "rounded-full px-4 py-2 text-sm text-ink-secondary transition-all duration-250 hover:bg-surface-overlay/60 hover:text-ink";
  const mobileLinkClass =
    "rounded px-4 py-3 text-sm text-ink-secondary transition-all duration-250 hover:bg-surface-overlay hover:text-ink";
  const isBlogPage = pathname.startsWith("/blog");

  function resolveHref(href: string, isSectionLink?: boolean) {
    if (!isSectionLink) {
      return href;
    }

    return pathname === "/" ? href : `/${href}`;
  }

  function getLinkClass(href: string, isMobile = false) {
    const baseClass = isMobile ? mobileLinkClass : linkClass;
    const isActive = isLinkActive(href);
    const activeClass = isMobile
      ? "bg-accent-dim text-ink ring-1 ring-accent/20"
      : "bg-accent-dim text-ink shadow-inner-highlight ring-1 ring-accent/20";

    return `${baseClass} ${isActive ? activeClass : ""}`;
  }

  function isLinkActive(href: string) {
    if (href === "/blog") {
      return isBlogPage;
    }

    if (!href.startsWith("#") || pathname !== "/") {
      return false;
    }

    return activeSection === href.slice(1);
  }

  function getAriaCurrent(href: string) {
    if (!isLinkActive(href)) {
      return undefined;
    }

    return href === "/blog" ? "page" : "location";
  }

  function handleLinkClick(href: string, isSectionLink?: boolean) {
    if (pathname === "/" && isSectionLink) {
      setActiveSection(href.slice(1));
    }

    handleCloseMenu();
  }

  function handleCloseMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <header
        data-nav-state={isOpen ? "open" : scrolled ? "scrolled" : "rest"}
        className="navbar-shell fixed inset-x-0 top-0 z-50 border-b transition-all duration-350"
      >
        <nav aria-label="Main navigation" className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={pathname === "/" ? "#home" : "/"}
            className="flex items-center gap-2.5"
            aria-label="Brad Malgas — home"
            onClick={handleCloseMenu}
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
                <Link
                  key={link.label}
                  href={resolveHref(link.href, link.section)}
                  className={getLinkClass(link.href)}
                  aria-current={getAriaCurrent(link.href)}
                  onClick={() => handleLinkClick(link.href, link.section)}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.label}
                  href={resolveHref(link.href, link.section)}
                  className={getLinkClass(link.href)}
                  aria-current={getAriaCurrent(link.href)}
                  onClick={() => handleLinkClick(link.href, link.section)}
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
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded text-ink hover:bg-surface-overlay transition-colors duration-250"
            onClick={() => setIsOpen((prev) => !prev)}
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
      </header>

      <div
        className={`md:hidden fixed inset-0 z-40 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-background/42 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={handleCloseMenu}
        />
        <div
          className={`mobile-nav-panel absolute inset-x-0 top-16 border-t border-border/50 shadow-lg backdrop-blur-lg will-change-transform transition-transform duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? "translate-y-0" : "-translate-y-6"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.internal ? (
                <Link
                  key={link.label}
                  href={resolveHref(link.href, link.section)}
                  className={getLinkClass(link.href, true)}
                  aria-current={getAriaCurrent(link.href)}
                  onClick={() => handleLinkClick(link.href, link.section)}
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.label}
                  href={resolveHref(link.href, link.section)}
                  className={getLinkClass(link.href, true)}
                  aria-current={getAriaCurrent(link.href)}
                  onClick={() => handleLinkClick(link.href, link.section)}
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
              onClick={handleCloseMenu}
            >
              Download CV
            </a>
            <ThemeToggle mobile />
          </div>
        </div>
      </div>
    </>
  );
}
