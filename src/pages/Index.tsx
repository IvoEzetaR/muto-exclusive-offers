import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import mutoLogo from "@/assets/muto-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Logo */}
          <div className="animate-fade-in-up mb-8">
            <img
              src={mutoLogo}
              alt="MUTO Resto Bar - Laboratorio Sensorial del Tiempo"
              className="w-40 h-40 sm:w-48 sm:h-48 mx-auto object-contain"
            />
          </div>

          {/* Heading */}
          <div className="animate-fade-in-up-delay mb-10">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 leading-tight">
              Déjanos tus datos
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-sm mx-auto">
              Para recibir promociones exclusivas para clientes{" "}
              <span className="text-primary font-medium">MUTO</span>
            </p>
          </div>

          {/* Form Card */}
          <div 
            className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-lg animate-fade-in-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
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
