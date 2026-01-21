import { Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://instagram.com/muto.restobar"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/muto.restobar"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/51999888777"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label="WhatsApp"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Av. La Mar 1234, Miraflores</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href="tel:+51999888777" className="hover:text-foreground transition-colors">
              +51 999 888 777
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:reservas@muto.pe" className="hover:text-foreground transition-colors">
              reservas@muto.pe
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-6" />

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MUTO Resto Bar - Laboratorio Sensorial del Tiempo</p>
          <p className="mt-1">Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};
