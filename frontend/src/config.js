import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const buildWhatsAppLink = (number, message) => {
  const clean = (number || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message || "")}`;
};

export const COLORS = {
  cream: "#FDF8F0",
  primary: "#D4822A",
  primaryHover: "#B5522B",
  primaryLight: "#FDEEDC",
  dark: "#1A1A2E",
  muted: "#4A4A5A",
  border: "#E5DCD0",
  whatsapp: "#25D366",
};

export const SOCIALS = {
  whatsapp: "237693819424",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
};
