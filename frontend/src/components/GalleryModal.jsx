import { useState } from "react";
import Modal from "@/components/Modal";

export default function GalleryModal({ open, onClose, editions }) {
  const [tab, setTab] = useState("edition-1");
  const current = editions.find((e) => e.id === tab) || editions[0];

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Archives MWCREW"
      title="Galerie"
      testid="gallery-modal"
    >
      {/* Tabs */}
      <div className="flex border border-zinc-800 mb-8" role="tablist">
        {editions.map((e) => (
          <button
            key={e.id}
            role="tab"
            onClick={() => setTab(e.id)}
            data-testid={`gallery-tab-${e.id}`}
            aria-selected={tab === e.id}
            className={`flex-1 px-4 py-3 font-heading text-sm md:text-base uppercase tracking-[0.2em] transition-colors ${
              tab === e.id
                ? "bg-white text-black"
                : "bg-[#0F0F0F] text-zinc-400 hover:text-white hover:bg-[#161616]"
            }`}
          >
            {e.label}
            <span
              className={`block font-mono text-[9px] tracking-[0.25em] mt-0.5 ${
                tab === e.id ? "text-black/60" : "text-zinc-600"
              }`}
            >
              {e.photos.length} photos
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
        data-testid={`gallery-grid-${current.id}`}
      >
        {current.photos.map((src, i) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`gallery-${current.id}-photo-${i + 1}`}
            className="group relative overflow-hidden border border-zinc-800 hover:border-white transition-colors aspect-square bg-[#0A0A0A]"
          >
            <img
              src={src}
              alt={`${current.label} — ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 bg-[#0A0A0A]/80 backdrop-blur px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {String(i + 1).padStart(2, "0")} / {String(current.photos.length).padStart(2, "0")}
            </div>
          </a>
        ))}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 text-center">
        Clique sur une photo pour la voir en grand
      </p>
    </Modal>
  );
}
