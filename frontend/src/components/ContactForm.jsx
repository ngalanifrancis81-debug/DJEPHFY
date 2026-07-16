import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { api, buildWhatsAppLink } from "../config";

export const ContactForm = ({ categories, quartiers, whatsapp, presetCategory }) => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", category: "", quartier: "", description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (presetCategory) setForm((f) => ({ ...f, category: presetCategory }));
  }, [presetCategory]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) return "Veuillez indiquer votre nom.";
    if (!form.phone.trim()) return "Veuillez indiquer votre téléphone / WhatsApp.";
    if (!form.category) return "Veuillez choisir un domaine.";
    if (!form.quartier) return "Veuillez indiquer votre quartier.";
    if (!form.description.trim()) return "Veuillez décrire votre besoin.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setSubmitting(true);
    try {
      await api.post("/requests", form);
      toast.success("Demande envoyée ! Nous vous mettrons en relation rapidement.");
      const msg = `Bonjour Djeph,\nNom: ${form.name}\nDomaine: ${form.category}\nQuartier: ${form.quartier}\nBesoin: ${form.description}`;
      window.open(buildWhatsAppLink(whatsapp, msg), "_blank");
      setForm({ name: "", phone: "", email: "", category: "", quartier: "", description: "" });
    } catch (e) {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full min-h-[48px] px-4 bg-white border border-[#E5DCD0] rounded-xl text-[#1A1A2E] placeholder:text-[#9A9AAA] focus:ring-2 focus:ring-[#D4822A]/20 focus:border-[#D4822A] focus:outline-none transition-all";

  return (
    <form data-testid="contact-form" onSubmit={submit} className="bg-white rounded-3xl border border-[#E5DCD0] shadow-sm p-6 sm:p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Nom complet *</label>
          <input data-testid="input-name" className={inputCls} placeholder="Ex: Jean Mballa" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Téléphone / WhatsApp *</label>
          <input data-testid="input-phone" className={inputCls} placeholder="Ex: 6XX XX XX XX" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Email</label>
          <input data-testid="input-email" type="email" className={inputCls} placeholder="votre@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Quartier *</label>
          <select data-testid="select-quartier" className={inputCls} value={form.quartier} onChange={(e) => update("quartier", e.target.value)}>
            <option value="">Choisir un quartier</option>
            {quartiers.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Domaine / Service *</label>
        <select data-testid="select-category" className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Choisir un domaine</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] font-bold text-[#D4822A] mb-2">Description du besoin *</label>
        <textarea data-testid="input-description" rows={4} className={`${inputCls} py-3 resize-none`} placeholder="Décrivez votre besoin en quelques mots..." value={form.description} onChange={(e) => update("description", e.target.value)} />
      </div>

      <button
        data-testid="submit-request-btn"
        type="submit"
        disabled={submitting}
        className="w-full min-h-[52px] rounded-full bg-[#D4822A] hover:bg-[#B5522B] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {submitting ? "Envoi..." : "Envoyer ma demande"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-[#4A4A5A]">
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        Vous serez aussi redirigé vers WhatsApp pour un contact rapide.
      </p>
    </form>
  );
};
