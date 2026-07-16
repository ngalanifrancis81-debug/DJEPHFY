import { Wrench, MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { buildWhatsAppLink, SOCIALS } from "../config";

export const Footer = ({ whatsapp }) => {
  const number = whatsapp || SOCIALS.whatsapp;
  return (
    <footer data-testid="site-footer" className="bg-[#1A1A2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4822A] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-2xl">Djeph</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              La plateforme qui connecte les habitants de Douala aux meilleurs professionnels qualifiés.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-[#D4822A]">Navigation</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#accueil" className="hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Nos services</a></li>
              <li><a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#apropos" className="hover:text-white transition-colors">À propos</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-[#D4822A]">Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4822A]" /> Douala, Cameroun</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#D4822A]" /> +{number}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#D4822A]" /> contact@djeph.cm</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-[#D4822A]">Suivez-nous</h4>
            <div className="flex gap-3">
              <a data-testid="footer-whatsapp" href={buildWhatsAppLink(number, "Bonjour Djeph !")} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href={SOCIALS.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4822A] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4822A] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Djeph. Tous droits réservés.</p>
          <a href="/admin" data-testid="footer-admin-link" className="hover:text-white transition-colors">Espace administration</a>
        </div>
      </div>
    </footer>
  );
};
