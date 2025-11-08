import { FormValues } from "@/types/common";
import { SubmitHandler } from "react-hook-form";

export const useFormTracking = () => {
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    // Limpeza e normalização de dados para Meta CAPI
    const rawPhone = data.phone.replace(/\D/g, '');
    const normalizedPhone = `55${rawPhone}`;

    // Função de redirecionamento com delay (EVENT CALLBACK)
    const kiwifyRedirect = () => {
      window.location.href = "https://pay.kiwify.com.br/0nFE1EN";
    };

    // Garante que o dataLayer existe
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      'event': 'form_submit_precheckout',
      'user_name': data.name,
      'user_email': data.email.toLowerCase().trim(),
      'user_phone': normalizedPhone,
      'eventCallback': kiwifyRedirect,
      'eventTimeout': 2000
    });
  };

  return {
    handleSubmit
  };
};