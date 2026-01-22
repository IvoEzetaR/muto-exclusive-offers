import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
    tipoIdentificacion: z.string().min(1, "Seleccione un tipo de identificación"),
    identificacion: z.string().trim().min(8, "Número de identificación inválido").max(20, "Número muy largo"),
    nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().trim().email("Correo electrónico inválido"),
    celular: z.string().trim().min(9, "Número de celular inválido").max(20, "Número muy largo").regex(/^[\d\s+()-]+$/, "Solo números y símbolos válidos"),
});

type FormData = z.infer<typeof formSchema>;

import { supabase } from "./supabaseClient";

export const FormQR = () => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        tipoIdentificacion: "DNI",
        identificacion: "",
        nombre: "",
        apellido: "",
        email: "",
        celular: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            const { error: fnError } = await supabase.functions.invoke('invite-user', {
                body: {
                    tipoIdentificacion: result.data.tipoIdentificacion,
                    identificacion: result.data.identificacion,
                    name: `${result.data.nombre} ${result.data.apellido}`,
                    email: result.data.email,
                    dni: result.data.identificacion,
                    celular: result.data.celular,
                    origin: window.location.origin // Pass current origin for QR link
                }
            });

            if (fnError) throw fnError;

            toast({
                title: "¡Registro exitoso!",
                description: "Tus datos han sido enviados y recibirás tu invitación por correo.",
            });

            setFormData({
                tipoIdentificacion: "DNI",
                identificacion: "",
                nombre: "",
                apellido: "",
                email: "",
                celular: ""
            });
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
            {/* Tipo de Identificación */}
            <div className="space-y-2">
                <label htmlFor="tipoIdentificacion" className="block text-sm font-medium text-foreground/90">
                    Tipo de Identificación
                </label>
                <select
                    id="tipoIdentificacion"
                    name="tipoIdentificacion"
                    value={formData.tipoIdentificacion}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground transition-all duration-200 focus:border-form-focus appearance-none ${errors.tipoIdentificacion ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">PASAPORTE</option>
                </select>
                {errors.tipoIdentificacion && (
                    <p className="text-sm text-destructive mt-1">{errors.tipoIdentificacion}</p>
                )}
            </div>

            {/* Identificación */}
            <div className="space-y-2">
                <label htmlFor="identificacion" className="block text-sm font-medium text-foreground/90">
                    Identificación
                </label>
                <input
                    type="text"
                    id="identificacion"
                    name="identificacion"
                    value={formData.identificacion}
                    onChange={handleChange}
                    placeholder="Número de documento"
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${errors.identificacion ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                />
                {errors.identificacion && (
                    <p className="text-sm text-destructive mt-1">{errors.identificacion}</p>
                )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-foreground/90">
                    Nombre
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tus nombres"
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${errors.nombre ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                />
                {errors.nombre && (
                    <p className="text-sm text-destructive mt-1">{errors.nombre}</p>
                )}
            </div>

            {/* Apellido */}
            <div className="space-y-2">
                <label htmlFor="apellido" className="block text-sm font-medium text-foreground/90">
                    Apellido
                </label>
                <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Tus apellidos"
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${errors.apellido ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                />
                {errors.apellido && (
                    <p className="text-sm text-destructive mt-1">{errors.apellido}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground/90">
                    Ingrese su correo
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${errors.email ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                />
                {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
            </div>

            {/* Celular */}
            <div className="space-y-2">
                <label htmlFor="celular" className="block text-sm font-medium text-foreground/90">
                    Ingrese su celular
                </label>
                <input
                    type="tel"
                    id="celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    placeholder="00000000"
                    className={`w-full px-4 py-3 bg-form-bg border rounded-lg text-foreground placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-form-focus ${errors.celular ? "border-destructive" : "border-form-border"
                        }`}
                    disabled={isSubmitting}
                />
                {errors.celular && (
                    <p className="text-sm text-destructive mt-1">{errors.celular}</p>
                )}
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
                    "Enviar"
                )}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
                Al enviar tus datos, aceptas compartir tu información de contacto.
            </p>
        </form>
    );
};
