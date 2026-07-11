"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useLanguage } from "@/lib/i18n";
import { useScrollDock } from "@/lib/use-scroll-dock";
import { cn } from "@/lib/utils";
import mainAvatar from "../../../mainAvatar.png";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, label, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative text-xs uppercase tracking-[0.15em] text-muted transition-colors duration-300",
        "hover:text-foreground"
      )}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export function Navigation() {
  const { copy } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith("/projects/");
  const isDocked = useScrollDock();
  const showDockedNav = isProjectPage || isDocked;
  const navLinks = [
    { label: copy.nav.about, href: "#about" },
    { label: copy.nav.projects, href: "#projects" },
    { label: copy.nav.experience, href: "#experience" },
    { label: copy.nav.skills, href: "#skills" },
    { label: copy.nav.contact, href: "#contact" },
  ];

  return (
    <motion.header
      className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="grid-layout relative flex h-14 items-center md:h-16 lg:h-[72px]"
        layout
      >
        <div
          className={cn(
            "absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center md:left-10 md:h-12 md:w-12 lg:left-16",
            showDockedNav ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <motion.div
            className="h-full w-full"
            initial={false}
            animate={{
              opacity: showDockedNav ? 1 : 0,
              scale: showDockedNav ? 1 : 0.45,
              x: showDockedNav ? 0 : 18,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/" aria-label="Home" className="block h-full w-full">
              <Image
                src={mainAvatar}
                alt="Mohamedhen Vall"
                className="h-full w-full object-contain"
                priority
              />
            </Link>
          </motion.div>
        </div>

        <motion.div
          layout
          className={cn(
            "flex items-center gap-3 md:gap-6",
            showDockedNav ? "ml-auto" : "mx-auto"
          )}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={isProjectPage ? `/${link.href}` : link.href}
                label={link.label}
              />
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className={cn(
                "flex h-8 w-8 items-center justify-center border border-border lg:hidden",
                "text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
      {menuOpen && (
        <motion.nav
          id="mobile-menu"
          className="grid-layout border-y border-border bg-background py-4 lg:hidden"
          aria-label="Mobile navigation"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={isProjectPage ? `/${link.href}` : link.href}
                label={link.label}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
