import { getIcon } from "../lib/iconMap";
import { ArrowRight } from "lucide-react";

export const ServiceCard = ({ category, index = 0, onSelect }) => {
  const Icon = getIcon(category.icon);
  return (
    <button
      data-testid={`service-card-${category.slug}`}
      onClick={() => onSelect(category)}
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
      className="group text-left bg-white rounded-2xl border border-[#E5DCD0]/60 shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-[#D4822A]/40 animate-fade-up focus:outline-none focus:ring-2 focus:ring-[#D4822A]/40"
    >
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${category.color}1A` }}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: category.color }} />
      </div>
      <h3 className="font-heading font-bold text-[15px] sm:text-lg text-[#1A1A2E] mb-1 leading-tight">
        {category.name}
      </h3>
      <p className="text-[13px] sm:text-sm text-[#4A4A5A] leading-snug line-clamp-2 mb-3">
        {category.description}
      </p>
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#D4822A]">
        Choisir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </span>
    </button>
  );
};
