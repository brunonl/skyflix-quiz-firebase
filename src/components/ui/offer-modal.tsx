import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, PartyPopper } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface OfferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  errors: any;
}

export const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onOpenChange, form, onSubmit, errors }) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="p-0 border-primary shadow-[0_0_30px_5px] shadow-primary/30 max-w-sm">
      <div className="p-8 text-center space-y-4">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <PartyPopper className="text-primary h-6 w-6" />
            Último passo para garantir seu desconto!
          </DialogTitle>
          <p className="text-muted-foreground">Preencha os dados abaixo para acessar a plataforma:</p>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <Input id="name" {...form.register("name", { required: "Nome é obrigatório" })} placeholder="Seu nome completo"/>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input id="email" type="email" {...form.register("email", { required: "E-mail é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" } })} placeholder="Seu melhor e-mail" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
           <div>
            <Input id="phone" type="tel" {...form.register("phone", { required: "Telefone é obrigatório" })} placeholder="Seu WhatsApp (com DDD)" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white text-lg h-12">Quero meu acesso com 50% OFF</Button>
        </form>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 pt-2">
          <Lock className="h-4 w-4"/> Seus dados estão seguros conosco
        </p>
      </div>
    </DialogContent>
  </Dialog>
);
