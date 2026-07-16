import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ArrowRight, Users, ShieldCheck, Clock, Star, Handshake, MessageSquare, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "../config";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppFAB } from "../components/WhatsAppFAB";
import { ServiceCard } from "../components/ServiceCard";
import { ContactForm } from "../components/ContactForm";

const HERO_IMG = "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxhZnJpY2FuJTIwcHJvZmVzc2lvbmFscyUyMHdvcmtpbmd8ZW58MHx8fHwxNzgxODQ2OTI3fDA&ixlib=rb-4.1.0&q=85";
const HOW_IMG = "https://images.unsplash.com/photo-1573496782432-8690d8148c46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODd8MHwxfHNlYXJjaHwyfHxzbWlsaW5nJTIwYWZyaWNhbiUyMHdvbWFuJTIwc21hcnRwaG9uZXxlbnwwfHx8fDE3ODQwNTMzMjB8MA&ixlib=rb-4.1.0&q=85";
const ABOUT_IMG = "https://images.unsplash.com/photo-1594386479412-fa62932f4cdc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxEb3VhbGElMjBDYW1lcm9vbiUyMGNpdHl8ZW58MHx8fHwxNzg0MTcxNDc4fDA&ixlib=rb-4.1.0&q=85";

const steps = [
  { icon: Search, title: "Choisissez un service", text: "Parcourez nos domaines d'activité et sélectionnez celui qui correspond à votre besoin." },
  { icon: MessageSquare, title: "Décrivez votre besoin", text: "Remplissez un formulaire simple : votre besoin, votre quartier et vos coordonnées." },
  { icon: Handshake, title: "Soyez mis en relation", text: "Nous vous connectons rapidement avec un professionnel qualifié près de chez vous." },
];

export default function Landing() {
  const [categories, setCategories] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [whatsapp, setWhatsapp] = useState("237693819424");
  const [search, setSearch] = useState("");
  const [presetCategory, setPresetCategory] = useState("");
  const contactRef = useRef(null);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
    api.get("/config").then((r) => { setQuartiers(r.data.quartiers); setWhatsapp(r.data.whatsapp_number); }).catch(() => {});
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const selectService = (cat) => {
    setPresetCategory(cat.name);
    if (contactRef.current) contactRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      <Header />

      {/* HERO */}
      <section id="accueil" data-testid="hero-section" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDEEDC] text-[#B5522B] text-xs font-bold uppercase tracking-[0.15em] mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Basé à Douala, Cameroun
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A2E] leading-[1.05]">
                Trouvez le bon <span className="text-[#D4822A]">professionnel</span> en quelques clics
              </h1>
              <p className="mt-6 text-base sm:text-lg text-[#4A4A5A] leading-relaxed max-w-xl">
                Djeph vous met en relation avec des artisans et prestataires qualifiés près de chez vous. Plomberie, électricité, informatique, santé et bien plus.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button data-testid="hero-find-btn" onClick={() => scrollTo("#services")} className="min-h-[52px] px-7 rounded-full bg-[#D4822A] hover:bg-[#B5522B] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95">
                  Trouver un professionnel <ArrowRight className="w-5 h-5" />
                </button>
                <button data-testid="hero-contact-btn" onClick={() => scrollTo("#contact")} className="min-h-[52px] px-7 rounded-full bg-white border border-[#E5DCD0] text-[#1A1A2E] font-semibold hover:border-[#D4822A] transition-all active:scale-95">
                  Contactez-nous
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div><p className="font-heading font-extrabold text-2xl text-[#1A1A2E]">{categories.length}+</p><p className="text-sm text-[#4A4A5A]">Domaines</p></div>
                <div className="w-px h-10 bg-[#E5DCD0]" />
                <div><p className="font-heading font-extrabold text-2xl text-[#1A1A2E]">20+</p><p className="text-sm text-[#4A4A5A]">Quartiers couverts</p></div>
                <div className="w-px h-10 bg-[#E5DCD0]" />
                <div><p className="font-heading font-extrabold text-2xl text-[#1A1A2E]">100%</p><p className="text-sm text-[#4A4A5A]">Local</p></div>
              </div>
            </div>
            <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#D4822A]/20 rounded-full blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5DCD0]">
                <img src={HERO_IMG} alt="Professionnel au travail" className="w-full h-[380px] lg:h-[480px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/40 to-transparent" />
              </div>
              <div className="absolute -bottom-5 left-4 sm:-left-6 bg-white rounded-2xl shadow-lg border border-[#E5DCD0] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#25D366]" /></div>
                <div><p className="font-heading font-bold text-sm text-[#1A1A2E]">Professionnels vérifiés</p><p className="text-xs text-[#4A4A5A]">Qualifiés & de confiance</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" data-testid="services-section" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4822A]">Nos services</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A2E] mt-2">Un domaine pour chaque besoin</h2>
            <p className="mt-3 text-base text-[#4A4A5A]">Sélectionnez une catégorie pour être mis en relation avec un professionnel adapté.</p>
          </div>

          <div className="relative max-w-md mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9AAA]" />
            <input
              data-testid="service-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un service..."
              className="w-full min-h-[52px] pl-12 pr-4 bg-[#FDF8F0] border border-[#E5DCD0] rounded-full focus:ring-2 focus:ring-[#D4822A]/20 focus:border-[#D4822A] focus:outline-none transition-all"
            />
          </div>

          {filtered.length === 0 ? (
            <p data-testid="no-services" className="text-[#4A4A5A]">Aucun service trouvé pour « {search} ».</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((c, i) => <ServiceCard key={c.id} category={c} index={i} onSelect={selectService} />)}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" data-testid="how-section" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4822A]">Comment ça marche</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A2E] mt-2 mb-8">Simple, rapide et efficace</h2>
              <div className="space-y-6">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} data-testid={`step-${i + 1}`} className="flex gap-4 items-start">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-[#D4822A] flex items-center justify-center"><Icon className="w-6 h-6 text-white" /></div>
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1A1A2E] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg text-[#1A1A2E]">{s.title}</h3>
                        <p className="text-[#4A4A5A] text-sm mt-1 leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button data-testid="how-cta" onClick={() => scrollTo("#contact")} className="mt-8 min-h-[52px] px-7 rounded-full bg-[#1A1A2E] hover:bg-[#2D2D44] text-white font-semibold inline-flex items-center gap-2 transition-all active:scale-95">
                Commencer maintenant <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E5DCD0]">
                <img src={HOW_IMG} alt="Utilisatrice sur smartphone" className="w-full h-[400px] lg:h-[500px] object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="apropos" data-testid="about-section" className="py-16 lg:py-24 bg-[#1A1A2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl order-2 lg:order-1">
              <img src={ABOUT_IMG} alt="Douala, Cameroun" className="w-full h-[400px] object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4822A]">À propos de Djeph</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2 mb-4">Ancrés à Douala, au service des habitants</h2>
              <p className="text-white/70 leading-relaxed">
                Djeph est née d'un constat simple : trouver un professionnel fiable à Douala peut être difficile. Notre mission est de faciliter la mise en relation entre les habitants et des prestataires qualifiés, dans tous les domaines du quotidien.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[{ icon: Users, t: "Proximité", d: "Des pros de votre quartier" }, { icon: ShieldCheck, t: "Confiance", d: "Prestataires qualifiés" }, { icon: Clock, t: "Rapidité", d: "Mise en relation express" }].map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <Icon className="w-7 h-7 text-[#D4822A] mb-3" />
                      <h3 className="font-heading font-bold">{v.t}</h3>
                      <p className="text-sm text-white/60 mt-1">{v.d}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={contactRef} data-testid="contact-section" className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D4822A]">Contact / Demande</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1A1A2E] mt-2">Décrivez votre besoin</h2>
            <p className="mt-3 text-base text-[#4A4A5A]">Remplissez le formulaire, nous vous mettons en relation avec un professionnel adapté.</p>
          </div>
          <ContactForm categories={categories} quartiers={quartiers} whatsapp={whatsapp} presetCategory={presetCategory} />
        </div>
      </section>

      <Footer whatsapp={whatsapp} />
      <WhatsAppFAB number={whatsapp} />
    </div>
  );
}
