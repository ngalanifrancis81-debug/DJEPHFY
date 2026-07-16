import { buildWhatsAppLink } from "../config";

export const WhatsAppFAB = ({ number }) => {
  return (
    <a
      data-testid="whatsapp-floating-btn"
      href={buildWhatsAppLink(number, "Bonjour Djeph, j'aimerais être mis en relation avec un professionnel.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#1EBE53] flex items-center justify-center shadow-lg pulse-ring transition-colors active:scale-95"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8 fill-white">
        <path d="M16.003 3C9.373 3 4 8.373 4 15c0 2.35.676 4.542 1.844 6.398L4 29l7.82-1.803A11.94 11.94 0 0016.003 27C22.63 27 28 21.627 28 15S22.63 3 16.003 3zm0 21.6a9.56 9.56 0 01-4.87-1.333l-.35-.208-4.64 1.07 1.086-4.52-.228-.365A9.53 9.53 0 016.4 15c0-5.29 4.31-9.6 9.603-9.6 5.29 0 9.597 4.31 9.597 9.6s-4.307 9.6-9.597 9.6zm5.27-7.19c-.29-.145-1.71-.844-1.976-.94-.264-.098-.457-.146-.65.144-.19.29-.744.94-.912 1.132-.168.193-.336.217-.626.072-.29-.145-1.223-.45-2.33-1.437-.86-.767-1.44-1.714-1.61-2.004-.168-.29-.018-.446.127-.59.13-.13.29-.336.435-.505.145-.168.193-.29.29-.483.096-.193.048-.362-.024-.507-.072-.145-.65-1.566-.89-2.146-.235-.564-.474-.487-.65-.496l-.554-.01c-.193 0-.507.072-.772.362-.264.29-1.013.99-1.013 2.41 0 1.42 1.037 2.793 1.182 2.986.145.193 2.04 3.115 4.943 4.37.69.298 1.23.476 1.65.61.693.22 1.324.19 1.823.115.556-.083 1.71-.7 1.952-1.375.24-.676.24-1.256.168-1.376-.07-.12-.264-.193-.554-.338z" />
      </svg>
    </a>
  );
};
