import { useEffect, useState, useCallback } from "react";
import { getCount } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import RegistrationForm from "@/components/RegistrationForm";
import { MapPin, Calendar, ArrowDown } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/60a2cc6e-e4c5-4b8a-aec5-19fd957b8916/images/29fc240cc135f55c29874977ca25765ecaa10367e61ef704412cf247290c3c13.png";

const EDITION_1 =
  "https://customer-assets.emergentagent.com/job_60a2cc6e-e4c5-4b8a-aec5-19fd957b8916/artifacts/grl73ji0_IMG_0942.jpeg";
const EDITION_2 =
  "https://customer-assets.emergentagent.com/job_60a2cc6e-e4c5-4b8a-aec5-19fd957b8916/artifacts/0fheyuar_IMG_2712.jpeg";

export default function Home() {
  const [soldOut, setSoldOut] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await getCount();
      setSoldOut(data.sold_out);
    } catch (err) {
      console.error("Failed to fetch registrations count:", err);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="home-page">
      <SiteHeader />

      {/* HERO */}
      <section
        className="relative pt-24 min-h-[100vh] flex flex-col justify-end overflow-hidden"
        data-testid="hero-section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/70 via-[#0A0A0A]/50 to-[#0A0A0A]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28 w-full">
          <div className="flex items-center gap-4 mb-8 fade-up">
            <div className="m-stripe h-[3px] w-14" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300">
              Édition 03 · 2026
            </span>
          </div>

          <h1
            className="font-heading text-6xl sm:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.9] fade-up-delay-1"
            data-testid="hero-title"
          >
            MWCREW
            <br />
            <span className="text-zinc-500">Balade</span>
          </h1>

          <div className="mt-10 grid sm:grid-cols-3 gap-6 max-w-4xl fade-up-delay-2">
            <InfoBlock icon={<Calendar className="w-4 h-4" />} label="Date">
              19 Juillet
            </InfoBlock>
            <InfoBlock icon={<MapPin className="w-4 h-4" />} label="Lieu">
              Lac de l'Eau d'Heure
            </InfoBlock>
            <InfoBlock label="Format">
              BMW M Only
            </InfoBlock>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 fade-up-delay-3">
            <a
              href="#inscription"
              data-testid="hero-cta-register"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 h-14 font-heading uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
            >
              Réserver ma place
            </a>
            <a
              href="#editions"
              data-testid="hero-cta-editions"
              className="inline-flex items-center justify-center gap-3 border border-zinc-700 text-white px-8 h-14 font-heading uppercase tracking-[0.2em] hover:border-white transition-colors"
            >
              Voir les éditions
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-zinc-900 overflow-hidden py-6">
        <div className="flex marquee-track whitespace-nowrap font-heading text-3xl md:text-5xl uppercase text-zinc-700">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-10 shrink-0">
              {[
                "BMW M Only",
                "1M · M2 · M3 · M4",
                "M5 · M6 · M8",
                "M Power",
                "Édition 03",
                "Lac de l'Eau d'Heure",
                "25 Pilotes",
                "19.07",
              ].map((t, j) => (
                <span key={j} className="flex items-center gap-10">
                  {t}
                  <span className="inline-block w-2 h-2 bg-[#E2252B]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PLACES — info only, no live counter */}
      <section className="py-24 md:py-32" data-testid="places-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                01 — Format
              </p>
              <h2 className="font-heading text-5xl md:text-6xl uppercase leading-[0.95]">
                Balade privée.
                <br />
                <span className="text-zinc-500">Places limitées.</span>
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="font-body text-zinc-300 text-lg leading-relaxed max-w-xl">
                Une balade entre passionnés autour du Lac de l'Eau d'Heure.
                Convoi M, points de vue, et un format intime — pas un meet de parking.
              </p>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                Sur inscription · BMW M uniquement · Confirmation par téléphone
              </p>
              <div className="m-stripe h-[3px] w-32 mt-10" />
            </div>
          </div>
        </div>
      </section>

      {/* EDITIONS GALLERY */}
      <section id="editions" className="py-24 md:py-32 bg-[#0d0d0d]" data-testid="editions-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
                02 — Archives
              </p>
              <h2 className="font-heading text-5xl md:text-6xl uppercase">
                Éditions précédentes
              </h2>
            </div>
            <p className="font-body text-zinc-400 max-w-md">
              Deux rassemblements, une même obsession pour la marque M. Voici d'où l'on vient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            <EditionCard
              n="01"
              year="Première édition"
              src={EDITION_1}
              caption="Première sortie officielle. Format intime, alignement parfait."
              testid="edition-1"
            />
            <EditionCard
              n="02"
              year="Deuxième édition"
              src={EDITION_2}
              caption="Le crew s'élargit. Dix-sept M sur tarmac, blackout dominant."
              testid="edition-2"
            />
          </div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="inscription" className="py-24 md:py-32" data-testid="registration-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
              03 — Inscription
            </p>
            <h2 className="font-heading text-5xl md:text-6xl uppercase leading-[0.95]">
              Rejoins l'édition 03.
            </h2>
            <p className="mt-6 text-zinc-400 max-w-2xl font-body">
              Remplis le formulaire ci-dessous. On te recontacte par téléphone pour valider ta place et te donner
              le point de ralliement précis autour du Lac de l'Eau d'Heure le 19 juillet.
            </p>

            <div
              className="mt-8 border border-[#E2252B]/50 bg-[#E2252B]/5 px-5 py-4 flex items-start gap-4"
              data-testid="m-only-notice"
            >
              <div className="m-stripe h-10 w-[3px] shrink-0" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#E2252B] mb-1">
                  M Power Only
                </p>
                <p className="font-body text-sm text-zinc-300">
                  Réservé exclusivement aux BMW M : <span className="text-white font-medium">1M, M2, M3, M4, M5, M6, M8</span>.
                  Les modèles M Performance (M135i, M235i, M340i, M440i…) ne sont pas acceptés.
                </p>
              </div>
            </div>
          </div>

          <RegistrationForm soldOut={soldOut} onSuccess={refresh} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-10" data-testid="site-footer">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="font-heading uppercase tracking-[0.2em] text-zinc-500 text-sm">
            MW<span className="text-[#E2252B]">/</span>CREW · Édition 03
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            19.07 · Lac de l'Eau d'Heure · BMW M Only
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoBlock({ icon, label, children, mono }) {
  return (
    <div className="border-l border-zinc-700 pl-4">
      <div className="flex items-center gap-2 mb-2 text-zinc-400">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
          {label}
        </span>
      </div>
      <div
        className={`${mono ? "font-mono text-2xl" : "font-heading text-2xl uppercase tracking-wide"} text-white`}
      >
        {children}
      </div>
    </div>
  );
}

function EditionCard({ n, year, src, caption, testid }) {
  return (
    <figure className="group" data-testid={testid}>
      <div className="relative overflow-hidden border border-zinc-800 aspect-[4/3]">
        <img
          src={src}
          alt={year}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 backdrop-blur px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white">
          Édition {n}
        </div>
      </div>
      <figcaption className="mt-4 flex items-start justify-between gap-6">
        <div>
          <div className="font-heading text-2xl uppercase">{year}</div>
          <div className="font-body text-sm text-zinc-400 mt-1 max-w-md">{caption}</div>
        </div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600 shrink-0">
          / {n}
        </div>
      </figcaption>
    </figure>
  );
}
