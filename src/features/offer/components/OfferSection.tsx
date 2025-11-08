import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FAQ } from "./FAQ";

interface OfferSectionProps {
  onOpenModal: () => void;
}

export const OfferSection = ({ onOpenModal }: OfferSectionProps) => {
  return (
    <div className="text-center animate-in zoom-in-95 duration-500 space-y-6 max-w-3xl mx-auto pb-8 sm:pb-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-primary mb-2">
        🎉 Parabéns! Seu cupom foi ativado!
      </h2>
      <p className="text-base sm:text-lg text-foreground/80 mb-6">
        Agora seu filho pode aprender sobre Deus brincando, em um ambiente seguro e livre de más influências 
        com um investimento único e vitalício.
      </p>

      <Card className="bg-card/70 border border-primary/50 max-w-md mx-auto text-center py-4">
        <CardContent className="p-2 sm:p-4">
          <p className="text-lg sm:text-xl font-bold text-secondary">✨ 50% DE DESCONTO VITALÍCIO ✨</p>
          <p className="text-md sm:text-lg text-foreground/80 mt-2">
            De <span className="line-through">R$99,00</span> por apenas:
          </p>
          <p className="text-4xl sm:text-5xl font-bold text-white my-1">R$47,90</p>
          <p className="text-xs sm:text-sm text-foreground/70">💙 (Pagamento único, acesso para sempre)</p>
        </CardContent>
      </Card>

      <div className="space-y-3 pt-4 text-sm sm:text-base">
        <div className="bg-card/50 border border-border/50 p-3 rounded-lg text-left">
          <p className="font-semibold text-base sm:text-lg">🎨 Super Kit de Desenhos para Colorir</p>
          <p className="text-sm sm:text-base text-muted-foreground">
            +200 desenhos para colorir por apenas R$14,90
          </p>
        </div>
        <div className="bg-card/50 border border-border/50 p-3 rounded-lg text-left">
          <p className="font-semibold text-base sm:text-lg">🏆 Super Kit de Jogos e Atividades Bíblicas</p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Vários jogos e atividades por apenas R$14,90
          </p>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={onOpenModal}
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse mt-8"
      >
        Comprar agora com desconto!
      </Button>

      <FAQ />
    </div>
  );
};