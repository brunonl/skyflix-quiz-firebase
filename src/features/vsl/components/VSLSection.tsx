import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { videoThumbnail } from "@/constants/quiz-data";

interface VSLSectionProps {
  onNext: () => void;
}

export const VSLSection = ({ onNext }: VSLSectionProps) => {
  return (
    <div className="w-full text-center space-y-8 animate-in fade-in duration-1000">
      <h2 className="text-3xl md:text-4xl font-bold">Por isso criamos o SKYFLIX!</h2>
      <p className="text-lg text-primary font-semibold">Assista o vídeo abaixo!</p>
      <div className="aspect-video bg-black overflow-hidden relative shadow-lg rounded-lg">
        <Image 
          src={videoThumbnail}
          alt="Video Sobre Skyflix"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Play className="w-20 h-20 text-white/80 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
      <Button size="lg" onClick={onNext}>
        Veja o que as famílias estão dizendo
      </Button>
    </div>
  );
};