import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, eyebrow, children, testid }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#0A0A0A]/95 backdrop-blur-sm flex items-stretch md:items-center justify-center overflow-y-auto"
      onClick={onClose}
      data-testid={testid}
    >
      <div
        className="relative w-full max-w-5xl my-0 md:my-12 mx-0 md:mx-6 bg-[#0F0F0F] border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m-stripe h-[2px] w-full" />
        <div className="flex items-start justify-between gap-6 px-6 md:px-10 pt-8 pb-6 border-b border-zinc-800">
          <div>
            {eyebrow && (
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            data-testid="modal-close"
            aria-label="Fermer"
            className="shrink-0 w-10 h-10 border border-zinc-800 hover:border-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 md:px-10 py-8">{children}</div>
      </div>
    </div>
  );
}
