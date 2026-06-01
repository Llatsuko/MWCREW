import { Link } from "react-router-dom";

export default function SiteHeader({ onOpenGallery, onOpenContact }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0A]/70 border-b border-zinc-900"
      data-testid="site-header"
    >
      <div className="m-stripe h-[2px] w-full" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-heading text-2xl tracking-[0.15em] uppercase text-white"
          data-testid="site-logo"
        >
          MW<span className="text-[#E2252B]">/</span>CREW
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={onOpenGallery}
            data-testid="header-gallery"
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors"
          >
            Galerie
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            data-testid="header-contact"
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors"
          >
            Contact
          </button>
          <a
            href="#inscription"
            className="font-mono text-xs uppercase tracking-[0.2em] text-white hover:text-[#E2252B] transition-colors"
            data-testid="header-cta"
          >
            S'inscrire
          </a>
        </div>
      </div>
    </header>
  );
}
