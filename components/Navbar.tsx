"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];

function NavLinks({
  activeHref,
  onItemClick,
  mobile = false,
}: {
  activeHref: string;
  onItemClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <ul className={mobile ? "flex flex-col" : "flex items-center gap-7"}>
      {navItems.map((item) => {
        const isActive = activeHref === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onItemClick}
              aria-current={isActive ? "page" : undefined}
              className={
                mobile
                  ? `flex min-h-11 items-center border-b border-line text-lg transition-colors ${
                      isActive ? "text-accent-ink" : "text-ink hover:text-accent-ink"
                    }`
                  : `relative py-2 text-[13px] tracking-[0.01em] transition-colors ${
                      isActive
                        ? "text-ink after:absolute after:inset-x-0 after:-bottom-[2px] after:h-px after:bg-accent"
                        : "text-ink-soft hover:text-ink"
                    }`
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeHref =
    pathname === "/"
      ? activeSection
      : pathname.startsWith("/projects")
        ? "/projects"
        : pathname === "/contact"
          ? "/contact"
          : "";

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["experience", "about"];
      const scrollPosition = window.scrollY + 140;

      let current = "";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el && scrollPosition >= el.offsetTop) {
          current = `/#${sectionId}`;
          break;
        }
      }
      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!showMenu) return;
    const panel = panelRef.current;
    if (!panel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

    focusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowMenu(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-line bg-paper/95">
      <div className="mx-auto flex h-full max-w-site items-center justify-between px-6 md:px-10 lg:px-16">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            Arpit Pandey
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            Frontend Developer
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <NavLinks activeHref={activeHref} />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 text-sm text-ink-soft xl:flex">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
            <span>Available for work</span>
          </div>
          <ThemeToggle className="hidden lg:grid" />
          <Button
            text="Download CV"
            link="/Resume.pdf"
            className="hidden lg:inline-flex"
          />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (showMenu ? closeMenu() : setShowMenu(true))}
            aria-label={showMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMenu}
            aria-controls="mobile-nav"
            className="grid size-11 place-items-center border border-line text-ink transition-colors hover:border-ink lg:hidden"
          >
            {showMenu ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      {showMenu && (
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-x-0 bottom-0 top-[72px] z-30 overflow-y-auto bg-paper px-6 py-8 lg:hidden"
        >
          <nav aria-label="Mobile">
            <NavLinks
              activeHref={activeHref}
              onItemClick={closeMenu}
              mobile
            />
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <ThemeToggle />
            <Button
              text="Download CV"
              link="/Resume.pdf"
              className="w-full"
            />
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-ink-soft">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
            <span>Available for work</span>
          </p>
        </div>
      )}
    </header>
  );
}
