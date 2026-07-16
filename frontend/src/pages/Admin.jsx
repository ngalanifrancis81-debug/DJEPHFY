import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock, LogOut, LayoutGrid, Inbox, Plus, Pencil, Trash2, X, Loader2,
  Wrench, ArrowLeft, Phone, Mail, MapPin,
} from "lucide-react";
import { API } from "../config";
import axios from "axios";
import { getIcon, ICON_NAMES } from "../lib/iconMap";

const STATUS = ["nouveau", "en cours", "traité"];
const STATUS_COLOR = { "nouveau": "#D4822A", "en cours": "#2A7DE1", "traité": "#2A5C3F" };

export default function Admin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("djeph_admin") || "");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("domaines");
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editing, setEditing] = useState(null);

  const authClient = useCallback(() => axios.create({
    baseURL: API, headers: { "X-Admin-Password": token },
  }), [token]);

  const loadData = useCallback(async () => {
    try {
      const c = await axios.get(`${API}/categories?include_inactive=true`);
      setCategories(c.data);
      const r = await authClient().get("/requests");
      setRequests(r.data);
    } catch (e) {
      if (e.response?.status === 401) { setToken(""); localStorage.removeItem("djeph_admin"); }
    }
  }, [authClient]);

  useEffect(() => { if (token) loadData(); }, [token, loadData]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password: pwd });
      setToken(res.data.token);
      localStorage.setItem("djeph_admin", res.data.token);
      toast.success("Connecté");
    } catch (e) {
      toast.error("Mot de passe incorrect");
    } finally { setLoading(false); }
  };

  const logout = () => { setToken(""); localStorage.removeItem("djeph_admin"); };

  const saveCategory = async (data) => {
    try {
      if (data.id) {
        await authClient().put(`/categories/${data.id}`, data);
        toast.success("Catégorie modifiée");
      } else {
        await authClient().post("/categories", data);
        toast.success("Catégorie ajoutée");
      }
      setEditing(null);
      loadData();
    } catch (e) { toast.error("Erreur lors de l'enregistrement"); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try { await authClient().delete(`/categories/${id}`); toast.success("Supprimée"); loadData(); }
    catch (e) { toast.error("Erreur"); }
  };

  const updateStatus = async (id, status) => {
    try { await authClient().put(`/requests/${id}/status`, { status }); loadData(); }
    catch (e) { toast.error("Erreur"); }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    try { await authClient().delete(`/requests/${id}`); toast.success("Supprimée"); loadData(); }
    catch (e) { toast.error("Erreur"); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4">
        <form data-testid="admin-login-form" onSubmit={login} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#D4822A] flex items-center justify-center mx-auto mb-6"><Lock className="w-7 h-7 text-white" /></div>
          <h1 className="font-heading text-2xl font-bold text-center text-[#1A1A2E]">Administration Djeph</h1>
          <p className="text-center text-sm text-[#4A4A5A] mt-1 mb-6">Entrez le mot de passe d'accès</p>
          <input data-testid="admin-password-input" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Mot de passe" className="w-full min-h-[48px] px-4 bg-[#FDF8F0] border border-[#E5DCD0] rounded-xl focus:ring-2 focus:ring-[#D4822A]/20 focus:border-[#D4822A] focus:outline-none mb-4" />
          <button data-testid="admin-login-btn" type="submit" disabled={loading} className="w-full min-h-[48px] rounded-full bg-[#D4822A] hover:bg-[#B5522B] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
          </button>
          <button type="button" onClick={() => navigate("/")} className="w-full mt-4 text-sm text-[#4A4A5A] hover:text-[#1A1A2E] flex items-center justify-center gap-1"><ArrowLeft className="w-4 h-4" /> Retour au site</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#1A1A2E] text-white lg:min-h-screen p-5 lg:p-6">
        <div className="flex items-center justify-between lg:justify-start gap-2 mb-6 lg:mb-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#D4822A] flex items-center justify-center"><Wrench className="w-5 h-5" /></div>
            <span className="font-heading font-extrabold text-xl">Djeph Admin</span>
          </div>
          <button onClick={logout} data-testid="admin-logout-btn" className="lg:hidden p-2"><LogOut className="w-5 h-5" /></button>
        </div>
        <nav className="flex lg:flex-col gap-2">
          <button data-testid="tab-domaines" onClick={() => setTab("domaines")} className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${tab === "domaines" ? "bg-[#D4822A] text-white" : "text-white/70 hover:bg-white/10"}`}>
            <LayoutGrid className="w-5 h-5" /> Domaines
          </button>
          <button data-testid="tab-demandes" onClick={() => setTab("demandes")} className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${tab === "demandes" ? "bg-[#D4822A] text-white" : "text-white/70 hover:bg-white/10"}`}>
            <Inbox className="w-5 h-5" /> Demandes
            {requests.filter((r) => r.status === "nouveau").length > 0 && <span className="ml-auto bg-white text-[#1A1A2E] text-xs font-bold px-2 py-0.5 rounded-full">{requests.filter((r) => r.status === "nouveau").length}</span>}
          </button>
        </nav>
        <div className="hidden lg:block mt-auto pt-10 space-y-2">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="w-4 h-4" /> Voir le site</button>
          <button onClick={logout} data-testid="admin-logout-btn-desktop" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white"><LogOut className="w-4 h-4" /> Déconnexion</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-5 sm:p-8">
        {tab === "domaines" && (
          <div data-testid="domaines-panel">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A2E]">Domaines d'activité</h1>
                <p className="text-sm text-[#4A4A5A] mt-1">{categories.length} catégorie(s)</p>
              </div>
              <button data-testid="add-category-btn" onClick={() => setEditing({ name: "", description: "", icon: "Wrench", color: "#D4822A", active: true })} className="min-h-[44px] px-4 rounded-full bg-[#D4822A] hover:bg-[#B5522B] text-white font-semibold flex items-center gap-2 transition-all active:scale-95">
                <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map((c) => {
                const Icon = getIcon(c.icon);
                return (
                  <div key={c.id} data-testid={`admin-cat-${c.slug}`} className="bg-white rounded-2xl border border-[#E5DCD0] p-5">
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}1A` }}><Icon className="w-5 h-5" style={{ color: c.color }} /></div>
                      <div className="flex gap-1">
                        <button data-testid={`edit-cat-${c.slug}`} onClick={() => setEditing(c)} className="p-2 rounded-lg hover:bg-[#FDEEDC] text-[#4A4A5A]"><Pencil className="w-4 h-4" /></button>
                        <button data-testid={`delete-cat-${c.slug}`} onClick={() => deleteCategory(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-[#1A1A2E] mt-3">{c.name}</h3>
                    <p className="text-sm text-[#4A4A5A] mt-1 line-clamp-2">{c.description}</p>
                    {!c.active && <span className="inline-block mt-2 text-xs font-bold text-[#4A4A5A] bg-[#F0EAE0] px-2 py-0.5 rounded-full">Inactif</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "demandes" && (
          <div data-testid="demandes-panel">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-6">Demandes reçues</h1>
            {requests.length === 0 ? (
              <p className="text-[#4A4A5A]">Aucune demande pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((r) => (
                  <div key={r.id} data-testid={`request-${r.id}`} className="bg-white rounded-2xl border border-[#E5DCD0] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-bold text-[#1A1A2E]">{r.name}</h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: STATUS_COLOR[r.status] || "#4A4A5A" }}>{r.status}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FDEEDC] text-[#B5522B]">{r.category}</span>
                        </div>
                        <p className="text-sm text-[#4A4A5A] mt-2">{r.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[#4A4A5A]">
                          <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#25D366]"><Phone className="w-3.5 h-3.5" /> {r.phone}</a>
                          {r.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {r.email}</span>}
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {r.quartier}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <select data-testid={`status-select-${r.id}`} value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="min-h-[40px] px-3 bg-[#FDF8F0] border border-[#E5DCD0] rounded-lg text-sm focus:outline-none focus:border-[#D4822A]">
                          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button data-testid={`delete-request-${r.id}`} onClick={() => deleteRequest(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {editing && <CategoryModal data={editing} onClose={() => setEditing(null)} onSave={saveCategory} />}
    </div>
  );
}

function CategoryModal({ data, onClose, onSave }) {
  const [form, setForm] = useState(data);
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full min-h-[46px] px-4 bg-[#FDF8F0] border border-[#E5DCD0] rounded-xl focus:ring-2 focus:ring-[#D4822A]/20 focus:border-[#D4822A] focus:outline-none";

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div data-testid="category-modal" className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-[#1A1A2E]">{form.id ? "Modifier" : "Ajouter"} un domaine</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#FDEEDC]"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Nom *</label>
            <input data-testid="cat-name-input" className={inputCls} value={form.name} onChange={(e) => up("name", e.target.value)} placeholder="Ex: Jardinage" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Description *</label>
            <textarea data-testid="cat-desc-input" rows={3} className={`${inputCls} py-3 resize-none`} value={form.description} onChange={(e) => up("description", e.target.value)} placeholder="Courte description du service" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Couleur</label>
              <input type="color" value={form.color} onChange={(e) => up("color", e.target.value)} className="w-full h-[46px] rounded-xl border border-[#E5DCD0] cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Actif</label>
              <select className={inputCls} value={form.active ? "1" : "0"} onChange={(e) => up("active", e.target.value === "1")}>
                <option value="1">Oui (visible)</option>
                <option value="0">Non (masqué)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Icône</label>
            <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-1">
              {ICON_NAMES.map((name) => {
                const Ic = getIcon(name);
                return (
                  <button key={name} type="button" onClick={() => up("icon", name)} className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${form.icon === name ? "border-[#D4822A] bg-[#FDEEDC]" : "border-[#E5DCD0] hover:border-[#D4822A]/40"}`}>
                    <Ic className="w-5 h-5" style={{ color: form.icon === name ? "#D4822A" : "#4A4A5A" }} />
                  </button>
                );
              })}
            </div>
          </div>
          <button data-testid="save-category-btn" onClick={() => { if (!form.name.trim() || !form.description.trim()) { toast.error("Nom et description requis"); return; } onSave(form); }} className="w-full min-h-[50px] rounded-full bg-[#D4822A] hover:bg-[#B5522B] text-white font-semibold transition-all active:scale-95">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
