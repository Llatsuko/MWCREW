import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  adminLogin,
  adminListRegistrations,
  adminDeleteRegistration,
} from "@/lib/api";
import { Lock, LogOut, Trash2, Loader2 } from "lucide-react";

const TOKEN_KEY = "mwcrew_admin_token";

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [photoModal, setPhotoModal] = useState(null);

  const fetchAll = useCallback(async (t) => {
    setFetching(true);
    try {
      const data = await adminListRegistrations(t);
      setRegistrations(data);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        toast.error("Session expirée");
      } else {
        toast.error("Erreur lors du chargement");
      }
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchAll(token);
  }, [token, fetchAll]);

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token: t } = await adminLogin(password);
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
      toast.success("Connecté");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setRegistrations([]);
  };

  const deleteOne = async (id, prenom) => {
    if (!confirm(`Supprimer l'inscription de ${prenom} ?`)) return;
    try {
      await adminDeleteRegistration(token, id);
      setRegistrations((r) => r.filter((x) => x.id !== id));
      toast.success("Inscription supprimée");
    } catch (err) {
      toast.error("Erreur");
    }
  };

  if (!token) {
    return (
      <div
        className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6"
        data-testid="admin-login-page"
      >
        <form
          onSubmit={submitLogin}
          className="w-full max-w-md border border-zinc-800 bg-[#121212] p-10"
        >
          <Link
            to="/"
            className="font-heading text-xl tracking-[0.2em] uppercase text-white block mb-10"
          >
            MW<span className="text-[#E2252B]">/</span>CREW
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-4 h-4 text-zinc-500" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">
              Accès Administrateur
            </span>
          </div>

          <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 block mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            required
            data-testid="input-admin-password"
            className="w-full h-12 bg-[#0A0A0A] border border-zinc-800 text-white px-4 outline-none focus:border-white font-body"
          />

          <button
            type="submit"
            disabled={loading}
            data-testid="submit-admin-login"
            className="mt-6 w-full bg-white text-black h-12 font-heading uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 inline-flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Se connecter"}
          </button>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 text-center">
            Accès réservé à l'organisation MWCREW
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="admin-dashboard">
      <div className="m-stripe h-[2px] w-full" />
      <header className="border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-heading text-xl tracking-[0.2em] uppercase"
            data-testid="admin-logo"
          >
            MW<span className="text-[#E2252B]">/</span>CREW
            <span className="ml-3 font-mono text-[11px] tracking-[0.25em] text-zinc-500">
              · ADMIN
            </span>
          </Link>
          <button
            onClick={logout}
            data-testid="admin-logout"
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white inline-flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">
              Inscriptions
            </p>
            <h1 className="font-heading text-5xl md:text-6xl uppercase">
              {String(registrations.length).padStart(2, "0")}
              <span className="text-zinc-600"> / 30</span>
            </h1>
          </div>
          <button
            onClick={() => fetchAll(token)}
            data-testid="admin-refresh"
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white border border-zinc-800 hover:border-white px-4 h-10"
          >
            {fetching ? "Chargement…" : "Rafraîchir"}
          </button>
        </div>

        <div className="border border-zinc-800 overflow-x-auto" data-testid="registrations-table">
          <table className="w-full text-left">
            <thead className="bg-[#121212] border-b border-zinc-800">
              <tr className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Prénom</th>
                <th className="px-4 py-4">BMW</th>
                <th className="px-4 py-4">Téléphone</th>
                <th className="px-4 py-4">Intérêt</th>
                <th className="px-4 py-4">Photo</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 && !fetching && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-600"
                  >
                    Aucune inscription pour le moment.
                  </td>
                </tr>
              )}
              {registrations.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-900 hover:bg-[#121212]"
                  data-testid={`registration-row-${i}`}
                >
                  <td className="px-4 py-4 font-mono text-xs text-zinc-500">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-4 font-heading text-lg uppercase">{r.prenom}</td>
                  <td className="px-4 py-4 font-body text-sm text-zinc-300">{r.modele_bmw}</td>
                  <td className="px-4 py-4 font-mono text-xs text-zinc-400">{r.telephone}</td>
                  <td className="px-4 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-300">
                    {interestLabel(r.interet)}
                  </td>
                  <td className="px-4 py-4">
                    {r.photo_base64 ? (
                      <button
                        onClick={() => setPhotoModal({ src: r.photo_base64, name: r.prenom })}
                        className="block w-16 h-12 border border-zinc-800 overflow-hidden hover:border-white"
                        data-testid={`photo-thumb-${i}`}
                      >
                        <img
                          src={r.photo_base64}
                          alt={r.prenom}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-[10px] text-zinc-500 whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => deleteOne(r.id, r.prenom)}
                      data-testid={`delete-row-${i}`}
                      className="text-zinc-500 hover:text-[#E2252B]"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {photoModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A0A]/90 flex items-center justify-center p-6"
          onClick={() => setPhotoModal(null)}
          data-testid="photo-modal"
        >
          <div
            className="max-w-3xl w-full border border-zinc-800 bg-[#121212]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-800">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">
                {photoModal.name}
              </span>
              <button
                onClick={() => setPhotoModal(null)}
                className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white"
              >
                Fermer
              </button>
            </div>
            <img
              src={photoModal.src}
              alt={photoModal.name}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function interestLabel(v) {
  switch (v) {
    case "1_jour":
      return "1 journée";
    case "2_jours":
      return "2 jours + hôtel";
    case "les_deux":
      return "Les deux";
    case "aucun":
      return "Aucun";
    default:
      return v;
  }
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
