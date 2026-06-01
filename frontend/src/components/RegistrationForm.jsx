import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createRegistration } from "@/lib/api";
import { Upload, Loader2, Check } from "lucide-react";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB raw

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RegistrationForm({ soldOut, onSuccess }) {
  const [prenom, setPrenom] = useState("");
  const [modele, setModele] = useState("");
  const [telephone, setTelephone] = useState("");
  const [interet, setInteret] = useState("les_deux");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Merci d'envoyer une image (JPG, PNG…).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Photo trop lourde. Max 5 Mo.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (soldOut) return;
    if (!prenom.trim() || !modele.trim() || !telephone.trim()) {
      toast.error("Merci de remplir prénom, modèle BMW et téléphone.");
      return;
    }
    setSubmitting(true);
    try {
      let photo_base64 = null;
      if (photoFile) {
        photo_base64 = await readFileAsDataURL(photoFile);
      }
      const res = await createRegistration({
        prenom: prenom.trim(),
        modele_bmw: modele.trim(),
        telephone: telephone.trim(),
        interet,
        photo_base64,
      });
      setDone(res);
      toast.success(`Inscription confirmée. Bienvenue ${res.prenom}.`);
      onSuccess?.();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Une erreur est survenue.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className="border border-zinc-800 bg-[#121212] p-10 md:p-14"
        data-testid="registration-success"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 border border-white flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">
            Inscription confirmée
          </span>
        </div>
        <h3 className="font-heading text-4xl md:text-5xl uppercase mb-4">
          Bienvenue dans la crew, {done.prenom}.
        </h3>
        <p className="text-zinc-400 font-body max-w-xl">
          Ton inscription est bien enregistrée pour l'Édition 3 du 19 juillet, en Wallonie.
          On revient vers toi par téléphone avec tous les détails du point de rendez-vous.
        </p>
        <div className="m-stripe h-[3px] w-24 mt-10" />
      </div>
    );
  }

  if (soldOut) {
    return (
      <div
        className="border border-zinc-800 bg-[#121212] p-10 md:p-14 text-center"
        data-testid="sold-out-state"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#E2252B] mb-4">
          Complet
        </p>
        <h3 className="font-heading text-4xl md:text-5xl uppercase mb-3">
          Inscriptions clôturées.
        </h3>
        <p className="text-zinc-400 font-body">
          La balade affiche complet. Reviens pour l'Édition 4, ou contacte-nous pour être en liste d'attente.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="border border-zinc-800 bg-[#121212] p-6 md:p-10"
      data-testid="registration-form"
      noValidate
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Prénom" required>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ton prénom"
            className="form-input"
            data-testid="input-prenom"
            required
          />
        </Field>

        <Field label="Modèle BMW" required hint="1M · M2 · M3 · M4 · M5 · M6 · M8">
          <input
            type="text"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            placeholder="ex. M3 G80, M4 F82, M2 G87…"
            className="form-input"
            data-testid="input-modele"
            required
          />
        </Field>

        <Field label="Numéro de téléphone" required>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+32 ..."
            className="form-input"
            data-testid="input-telephone"
            required
          />
        </Field>

        <Field label="Photo de la voiture" hint="JPG / PNG · max 5 Mo">
          <label
            htmlFor="photo-input"
            className="flex items-center gap-3 border border-zinc-800 bg-[#0A0A0A] px-4 h-12 cursor-pointer hover:border-zinc-600 transition-colors"
            data-testid="photo-dropzone"
          >
            <Upload className="w-4 h-4 text-zinc-500" />
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-zinc-400 truncate">
              {photoFile ? photoFile.name : "Téléverser une photo"}
            </span>
          </label>
          <input
            id="photo-input"
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
            data-testid="input-photo"
          />
          {photoPreview && (
            <div className="mt-3 border border-zinc-800" data-testid="photo-preview">
              <img
                src={photoPreview}
                alt="Aperçu voiture"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
        </Field>
      </div>

      <div className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">
          Prochaines éditions — serais-tu prêt·e à payer pour ?
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { v: "1_jour", label: "1 journée", sub: "Visites + restaurant" },
            { v: "2_jours", label: "2 jours", sub: "Avec hôtel inclus" },
            { v: "les_deux", label: "Les deux", sub: "1 jour & 2 jours" },
            { v: "aucun", label: "Aucun", sub: "Juste cette édition" },
          ].map((opt) => (
            <button
              type="button"
              key={opt.v}
              onClick={() => setInteret(opt.v)}
              data-testid={`interet-${opt.v}`}
              className={`text-left border p-4 transition-colors ${
                interet === opt.v
                  ? "border-white bg-white text-black"
                  : "border-zinc-800 bg-[#0A0A0A] text-white hover:border-zinc-600"
              }`}
            >
              <div className="font-heading text-xl uppercase">{opt.label}</div>
              <div
                className={`font-mono text-[10px] uppercase tracking-[0.15em] mt-1 ${
                  interet === opt.v ? "text-black/70" : "text-zinc-500"
                }`}
              >
                {opt.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500 max-w-md">
          En t'inscrivant, tu acceptes d'être recontacté·e par téléphone pour confirmer ta place.
        </p>
        <button
          type="submit"
          disabled={submitting}
          data-testid="submit-registration"
          className="group inline-flex items-center justify-center gap-3 bg-white text-black px-8 h-14 font-heading text-base uppercase tracking-[0.2em] hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi…
            </>
          ) : (
            <>
              Réserver ma place
              <span className="w-6 h-[1px] bg-black group-hover:w-10 transition-all" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          {label}
          {required && <span className="text-[#E2252B] ml-1">*</span>}
        </label>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
            {hint}
          </span>
        )}
      </div>
      {children}
      <style>{`
        .form-input {
          background-color: #0A0A0A;
          border: 1px solid #27272a;
          color: white;
          height: 48px;
          padding: 0 16px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .form-input::placeholder { color: #52525b; }
        .form-input:focus { border-color: #ffffff; }
      `}</style>
    </div>
  );
}
