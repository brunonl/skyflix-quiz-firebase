import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/image-slider";
import { sliderImages } from "@/constants/quiz-data";

interface IntroSectionProps {
  onStart: () => void;
}

export const IntroSection = ({ onStart }: IntroSectionProps) => {
  return (
    <div className="text-center animate-in fade-in duration-500 w-full flex flex-col items-center">
      <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto text-primary">
        Enquanto você trabalha, a internet educa.
      </h1>
      <p className="text-base sm:text-lg md:text-3xl font-medium mb-4 max-w-3xl mx-auto text-white">
        O que seu filho está assistindo hoje...<br />Pode moldar quem ele será amanhã.
      </p>
      <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 max-w-3xl mx-auto">
        O <strong className="text-tertiary">SKYFLIX</strong> foi criado pra mudar isso, uma plataforma cristã segura, 
        com <strong className="text-tertiary">conteúdos cuidadosamente selecionados</strong> de forma criteriosa, 
        que ensinam sobre Deus de um jeito leve, divertido e livre de influências ruins.
      </p>
      <p className="mb-2 font-semibold text-white">💙 Quero proteger o meu filho agora!</p>
      <Button 
        size="lg" 
        className="w-full md:w-auto mb-10 animate-zoom-pulse bg-primary hover:bg-primary/90 text-primary-foreground" 
        onClick={onStart}
      >
        Conhecer a plataforma
      </Button>

      <ImageSlider images={sliderImages} />
    </div>
  );
};