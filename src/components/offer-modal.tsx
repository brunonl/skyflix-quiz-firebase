import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { UseFormReturn, Controller } from "react-hook-form";

interface OfferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  errors: any;
}

// Função para aplicar a máscara de telefone
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.substring(0, 11);
  if (value.length > 10) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }
  e.target.value = value;
};

export const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onOpenChange, form, onSubmit, errors }) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md p-0">
      <div className="p-8 space-y-6">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-balance">
            Último passo para garantir seu desconto!
          </DialogTitle>
          <p className="text-muted-foreground text-balance">
            Preencha abaixo para garantir seu acesso à plataforma.
          </p>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">Nome completo</label>
            <Input 
              id="name" 
              {...form.register("name", { required: "Nome é obrigatório" })} 
              placeholder="Seu nome completo"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">E-mail</label>
            <Input 
              id="email" 
              type="email" 
              {...form.register("email", { 
                required: "E-mail é obrigatório", 
                pattern: { value: /\S+@\S+\.\S+/, message: "Formato de e-mail inválido" } 
              })} 
              placeholder="exemplo@email.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
             <label htmlFor="phone" className="text-sm font-medium leading-none">WhatsApp</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="mr-1">🇧🇷</span>
                    <span className="text-sm text-muted-foreground">+55</span>
                </div>
                <Controller
                    name="phone"
                    control={form.control}
                    rules={{
                        required: "WhatsApp é obrigatório",
                        validate: (value) => (value.replace(/\D/g, '').length >= 10 && value.replace(/\D/g, '').length <= 11) || "O telefone deve ter 10 ou 11 dígitos"
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="phone"
                            type="tel"
                            placeholder="(DDD) 99999-9999"
                            onChange={(e) => {
                                handlePhoneChange(e);
                                field.onChange(e.target.value);
                            }}
                            className="pl-14"
                        />
                    )}
                />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message as string}</p>}
          </div>
          
          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Quero meu acesso com 50% OFF agora</Button>
        </form>
        
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Lock className="h-3 w-3"/> Seus dados estão 100% seguros conosco.
        </p>
      </div>
    </DialogContent>
  </Dialog>
);