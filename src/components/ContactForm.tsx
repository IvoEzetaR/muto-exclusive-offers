import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es muy largo"),
  whatsapp: z.string().trim().min(8, "Número de WhatsApp inválido").max(20, "Número muy largo").regex(/^[\d\s+()-]+$/, "Solo números y símbolos válidos"),
  email: z.string().trim().email("Correo electrónico inválido"),
  cumpleanos: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const WEBHOOK_URL = "https://n8n-n8n.op5xvn.easypanel.host/webhook/form-lovable";

export const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    whatsapp: "",
    email: "",
    cumpleanos: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate form
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          nombre: result.data.nombre,
          whatsapp: result.data.whatsapp,
          email: result.data.email,
          cumpleanos: result.data.cumpleanos || null,
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "¡Gracias por registrarte!",
        description: "Pronto recibirás nuestras promociones exclusivas.",
      });

      setFormData({ nombre: "", whatsapp: "", email: "", cumpleanos: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tus datos. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      {/* Nombre y Apellido */}
      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-medium text-foreground/90">
          Nombre y Apellido <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingresa tu nombre completo"
          className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${
            errors.nombre ? "border-destructive" : "border-form-border"
          }`}
          disabled={isSubmitting}
        />
        {errors.nombre && (
          <p className="text-sm text-destructive mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground/90">
          WhatsApp <span className="text-accent">*</span>
        </label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="+51 999 999 999"
          className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${
            errors.whatsapp ? "border-destructive" : "border-form-border"
          }`}
          disabled={isSubmitting}
        />
        {errors.whatsapp && (
          <p className="text-sm text-destructive mt-1">{errors.whatsapp}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground/90">
          Correo Electrónico <span className="text-accent">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${
            errors.email ? "border-destructive" : "border-form-border"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      {/* Cumpleaños */}
      <div className="space-y-2">
        <label htmlFor="cumpleanos" className="block text-sm font-medium text-foreground/90">
          Fecha de Cumpleaños <span className="text-muted-foreground text-xs">(opcional)</span>
        </label>
        <input
          type="date"
          id="cumpleanos"
          name="cumpleanos"
          value={formData.cumpleanos}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-form-bg border border-form-border rounded-lg text-foreground transition-all duration-200 focus:border-form-focus [color-scheme:dark]"
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Enviando...
          </span>
        ) : (
          "Quiero recibir promociones"
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Al registrarte, aceptas recibir promociones de MUTO Resto Bar
      </p>
    </form>
);
};
