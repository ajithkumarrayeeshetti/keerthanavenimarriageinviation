import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";

const links = [
  { to: "/", key: "home" as const },
  { to: "/story", key: "story" as const },
  { to: "/events", key: "events" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/wishes", key: "wishes" as const },
  { to: "/rsvp", key: "rsvp" as const },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang].nav;

  // Compress the bar once the guest scrolls past the hero — smaller logo,
  // tighter padding, deeper shadow — then expand back at the very top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative font-body text-sm tracking-wide transition-colors pb-1 ${
      isActive
        ? "text-gold-dark font-semibold nav-link-active"
        : "text-maroon hover:text-gold-dark"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-gold transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <nav
        className={`max-w-6xl mx-auto px-5 flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled ? "py-1.5" : "py-3"
        }`}
      >
        <NavLink
          to="/"
          className={`font-display italic text-maroon transition-all duration-300 ease-out ${
            scrolled ? "text-lg sm:text-xl" : "text-2xl"
          }`}
        >
          {weddingConfig.initials}
        </NavLink>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === "/"}>
              {t[l.key]}
            </NavLink>
          ))}
          <button
            onClick={toggleLang}
            className="ml-2 text-xs font-semibold tracking-wider border border-gold rounded-full px-3 py-1 text-maroon hover:bg-gold hover:text-white transition-colors"
          >
            {lang === "en" ? "EN | తె" : "తె | EN"}
          </button>
        </div>

        <button
          className="md:hidden text-maroon"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden animate-fadeSlideDown bg-white border-t border-gold/40 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
            >
              {t[l.key]}
            </NavLink>
          ))}
          <button
            onClick={toggleLang}
            className="self-start text-xs font-semibold tracking-wider border border-gold rounded-full px-3 py-1 text-maroon"
          >
            {lang === "en" ? "EN | తె" : "తె | EN"}
          </button>
        </div>
      )}
    </header>
  );
}
