import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";
import { videoThumbnail } from "@/constants/quiz-data";

interface TestimonialsSectionProps {
  onNext: () => void;
}

export const TestimonialsSection = ({ onNext }: TestimonialsSectionProps) => {
  return (
    <div className="w-full text-center space-y-5 animate-in fade-in duration-1000">
      <h2 className="text-2xl font-bold">O que as famílias estão dizendo sobre o SKYFLIX</h2>
      <p className="text-lg text-primary font-semibold">Assista os depoimentos abaixo!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map(i => (
          <div key={i} className="aspect-video bg-black overflow-hidden relative shadow-lg">
            <Image 
              src={`https://picsum.photos/seed/depoimento${i}/400/225`} 
              layout="fill" 
              objectFit="cover" 
              alt={`Depoimento de família ${i}`} 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="w-16 h-16 text-white/70 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
      <Button 
        size="lg" 
        onClick={onNext} 
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse"
      >
        Quero garantir meu acesso com desconto!
      </Button>
    </div>
  );
};