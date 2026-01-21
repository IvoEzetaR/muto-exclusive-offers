import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import mutoLogo from "@/assets/muto-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Particles Background */}
      <ParticlesBackground />

      {/* Radial gradient overlay for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(80_12%_20%_/_0.6)_100%)]" />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 relative z-10">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Logo with floating animation */}
          <div className="animate-float mb-8">
            <div className="relative">
              <img
                src={mutoLogo}
                alt="MUTO Resto Bar - Laboratorio Sensorial del Tiempo"
                className="w-40 h-40 sm:w-48 sm:h-48 mx-auto object-contain drop-shadow-[0_0_30px_hsla(40,30%,85%,0.3)]"
              />
              {/* Subtle glow ring */}
              <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-spin-slow" style={{ animationDuration: '20s' }} />
            </div>
          </div>

          {/* Heading with staggered animation */}
          <div className="animate-fade-in-up mb-10" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 leading-tight tracking-wide">
              Déjanos tus datos
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
              Para recibir promociones exclusivas para clientes{" "}
              <span className="text-primary font-medium animate-pulse-soft">MUTO</span>
            </p>
          </div>

          {/* Form Card with glass morphism effect */}
          <div
            className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 shadow-2xl animate-fade-in-up"
            style={{ animationDelay: "0.6s", opacity: 0 }}
          >
            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <ContactForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
