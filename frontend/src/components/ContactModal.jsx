import Modal from "@/components/Modal";
import { Instagram, Phone } from "lucide-react";

// TikTok official icon (lucide doesn't ship one) — simple inline SVG
const TikTokIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

const CONTACTS = [
  {
    type: "instagram",
    label: "Instagram",
    value: "@mwcrew_",
    href: "https://www.instagram.com/mwcrew_/",
    icon: Instagram,
  },
  {
    type: "tiktok",
    label: "TikTok",
    value: "@mwcrew_",
    href: "https://www.tiktok.com/@mwcrew_",
    icon: TikTokIcon,
  },
  {
    type: "phone-1",
    label: "Téléphone",
    value: "+32 455 19 09 81",
    href: "tel:+32455190981",
    icon: Phone,
  },
  {
    type: "phone-2",
    label: "Téléphone",
    value: "+32 494 70 42 67",
    href: "tel:+32494704267",
    icon: Phone,
  },
];

export default function ContactModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Reste connecté"
      title="Contact"
      testid="contact-modal"
    >
      <p className="font-body text-zinc-400 mb-8 max-w-xl">
        Pour toute question, proposition ou simplement nous suivre — voici comment nous joindre.
      </p>

      <div className="grid sm:grid-cols-2 gap-3" data-testid="contact-list">
        {CONTACTS.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.type}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              data-testid={`contact-${c.type}`}
              className="group flex items-center gap-4 border border-zinc-800 hover:border-white bg-[#0A0A0A] p-5 transition-colors"
            >
              <div className="w-12 h-12 border border-zinc-700 group-hover:border-white flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  {c.label}
                </p>
                <p className="font-heading text-lg uppercase tracking-wide text-white truncate">
                  {c.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="m-stripe h-[3px] w-24 mt-10" />
    </Modal>
  );
}
