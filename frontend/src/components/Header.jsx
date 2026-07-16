import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos services", href: "#services" },
  { label: "Comment ça marche", href: "#comment" },
  { label: "À propos", href: "#apropos" },
  { label: "Contact", href: "#contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (href) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all ${
        scrolled ? "bg-[#FDF8F0]/95 border-[#E5DCD0] shadow-sm" : "bg-[#FDF8F0]/80 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" data-testid="logo-link" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#D4822A] flex items-center justify-center group-hover:rotate-6 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-heading font-extrabold text-2xl text-[#1A1A2E] tracking-tight">Djeph</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4822A]">Douala</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.href}
                data-testid={`nav-${l.href.slice(1)}`}
                onClick={() => goTo(l.href)}
                className="px-4 py-2 rounded-full text-[15px] font-medium text-[#4A4A5A] hover:text-[#1A1A2E] hover:bg-[#FDEEDC] transition-all"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="header-cta"
              onClick={() => goTo("#contact")}
              className="ml-2 px-5 py-2.5 rounded-full bg-[#1A1A2E] text-white font-semibold hover:bg-[#2D2D44] transition-all active:scale-95"
            >
              Trouver un pro
            </button>
          </nav>

          <button
            data-testid="mobile-menu-toggle"
            className="lg:hidden p-2 rounded-lg text-[#1A1A2E]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="lg:hidden border-t border-[#E5DCD0] bg-[#FDF8F0] px-4 py-4 space-y-1">
          {links.map((l) => (
            <button
              key={l.href}
              data-testid={`mobile-nav-${l.href.slice(1)}`}
              onClick={() => goTo(l.href)}
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-[#1A1A2E] hover:bg-[#FDEEDC]"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => goTo("#contact")}
            className="block w-full px-4 py-3 rounded-xl bg-[#D4822A] text-white font-semibold text-center"
          >
            Trouver un professionnel
          </button>
        </div>
      )}
    </header>
  );
};
