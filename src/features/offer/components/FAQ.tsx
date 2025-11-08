import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const FAQ = () => {
  return (
    <div className="w-full pt-8">
      <h3 className="text-lg font-semibold mb-6">Perguntas Frequentes</h3>
      <Accordion type="multiple" defaultValue={["faq1"]} className="w-full flex flex-col gap-4">
        <AccordionItem value="faq1" className="border bg-card/60">
          <AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">
            Onde posso assistir?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-left px-4 pb-4">
            Assista onde quiser, quando quiser. Faça login com sua conta para começar a assistir no 
            computador ou em qualquer aparelho como Smart TVs, smartphones, tablets, aparelhos de 
            streaming e videogames. Você também pode baixar os seus episódios favoritos com iOS, 
            Android ou Windows 10. Use downloads para levar a Skyflix para onde quiser sem precisar 
            de conexão com a Internet.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="faq2" className="border bg-card/60">
          <AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">
            Como será disponibilizado o meu acesso à plataforma?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-left px-4 pb-4">
            Após a confirmação do pagamento, o acesso à plataforma será imediatamente liberado. 
            Você receberá um e-mail contendo o link de acesso para baixar o aplicativo, além de 
            seu login e senha exclusivos.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="faq3" className="border bg-card/60">
          <AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">
            Para quais idades o skyflix é voltado?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-4 text-left pb-4">
            Nosso conteúdo é voltado para crianças de 1 a 10 anos
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};