import {
  Droplet, Zap, Hammer, Building2, Car, Laptop, Microwave, Sparkles,
  Shield, UtensilsCrossed, Scissors, Truck, Scale, Stethoscope,
  GraduationCap, Camera, Wrench, Wind, Paintbrush, Baby, Dog, Leaf,
  Home, Package, Phone, Heart, Music, Briefcase,
} from "lucide-react";

export const ICONS = {
  Droplet, Zap, Hammer, Building2, Car, Laptop, Microwave, Sparkles,
  Shield, UtensilsCrossed, Scissors, Truck, Scale, Stethoscope,
  GraduationCap, Camera, Wrench, Wind, Paintbrush, Baby, Dog, Leaf,
  Home, Package, Phone, Heart, Music, Briefcase,
};

export const ICON_NAMES = Object.keys(ICONS);

export const getIcon = (name) => ICONS[name] || Wrench;
