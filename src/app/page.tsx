
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { trackEvent } from "@/lib/tracking";
import { Loader2, Volume2, VolumeX, Play, Check, Lock, ChevronLeft, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

type Stage = 'intro' | 'quiz' | 'reveal' | 'social' | 'loading' | 'offer';
type FormValues = { name: string; email: string; phone: string; };

const quizQuestions = [
  { id: 1, text: "Você acredita que o conteúdo que seu filho consome hoje pode influenciar o comportamento dele no futuro?", answers: ["A. Com certeza, e isso me preocupa.", "B. Sim, mas é difícil controlar tudo.", "C. Talvez, nunca pensei nisso.", "D. Não tenho certeza."] },
  { id: 2, text: "Você já sentiu medo de deixar seu filho sozinho com o celular ou YouTube?", answers: ["A. Sim, o tempo todo.", "B. Sim, mas tento monitorar.", "C. Às vezes, depende do conteúdo."] },
  { id: 3, text: "E se você pudesse oferecer um ambiente 100% seguro, com desenhos e histórias que ensinam valores cristãos, você usaria?", answers: ["A. Sim, com certeza!", "B. Sim, se fosse fácil de usar.", "C. Talvez, depende do conteúdo."] },
  { id: 4, text: "Qual dessas opções mais representa o que você quer pro seu filho?", answers: ["A. Um ambiente seguro e sem influências ruins.", "B. Um conteúdo que ensine valores cristãos de forma divertida.", "C. Algo que estimule a criatividade e a fé ao mesmo tempo.", "D. Todas as opções acima."] },
];

const sliderImages = [
  "https://skyflix-quiz.vercel.app/images/historys/h1.png",
  "https://skyflix-quiz.vercel.app/images/historys/h2.png",
  "https://skyflix-quiz.vercel.app/images/historys/h3.png",
  "https://skyflix-quiz.vercel.app/images/historys/h4.png",
  "https://skyflix-quiz.vercel.app/images/historys/h5.png",
  "https://skyflix-quiz.vercel.app/images/historys/h6.png",
];

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const playAudio = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented. User needs to interact first.
      });
    }
  }, []);
  
  useEffect(() => {
    const audioEl = document.getElementById("background-music") as HTMLAudioElement;
    if (audioEl) {
      audioRef.current = audioEl;
      // Autoplay with sound is often blocked. We'll attempt to play it, 
      // and rely on a user click if it fails.
      playAudio();
      const playOnClick = () => playAudio();
      document.addEventListener('click', playOnClick, { once: true });
      
      return () => {
        document.removeEventListener('click', playOnClick);
      };
    }
  }, [playAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const totalSteps = quizQuestions.length + 4; // intro, quizzes, reveal, social, loading, offer
    let currentStep = 0;
    if(stage === 'intro') currentStep = 0;
    if(stage === 'quiz') currentStep = questionIndex + 1;
    if(stage === 'reveal') currentStep = quizQuestions.length + 1;
    if(stage === 'social') currentStep = quizQuestions.length + 2;
    if(stage === 'loading') currentStep = quizQuestions.length + 3;
    if(stage === 'offer') currentStep = quizQuestions.length + 4;
    
    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);

    trackEvent('step_view', { step_id: stage, step_number: currentStep, progress: newProgress });
  }, [stage, questionIndex]);

  useEffect(() => {
    if (stage === 'loading') {
      const timer = setTimeout(() => {
        setStage('offer');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);
  
  useEffect(() => {
    setSelectedAnswer(null);
  }, [questionIndex, stage]);

  const handleStartQuiz = () => {
    trackEvent('start_quiz');
    setStage('quiz');
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    trackEvent('answer_question', {
      question_id: `question_${questionIndex + 1}`,
      question_text: quizQuestions[questionIndex].text,
      answer: answer,
    });
    setTimeout(() => {
      if (questionIndex < quizQuestions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        setStage('reveal');
      }
    }, 300);
  };

  const handleBack = () => {
    if (stage === 'quiz') {
      if (questionIndex > 0) {
        setQuestionIndex(prev => prev - 1);
      } else {
        setStage('intro');
      }
    } else if (stage === 'reveal') {
      setStage('quiz');
      setQuestionIndex(quizQuestions.length - 1);
    } else if (stage === 'social') {
      setStage('reveal');
    }
  };

  const onModalSubmit: SubmitHandler<FormValues> = (data) => {
    trackEvent('open_modal', {
      user_name: data.name,
      user_email: data.email,
      user_phone: data.phone,
    });
    trackEvent('checkout_redirect');
    window.location.href = "https://pay.kiwify.com.br/0nFE1EN";
  };

  const toggleMute = () => {
    setIsMuted(prev => {
        if(audioRef.current) {
            audioRef.current.muted = !prev;
        }
        return !prev;
    });
  };

  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="text-center animate-in fade-in duration-500 w-full flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-3xl mx-auto text-white">
              O que seu filho está assistindo hoje...<br />Pode moldar quem ele será amanhã.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Enquanto você trabalha, a internet educa. Mas será que é esse o tipo de educação que você quer para o seu filho?
            </p>
            <div className="w-full overflow-hidden relative mb-8">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
              <Carousel 
                opts={{ loop: true, align: "start" }}
                plugins={[ Autoplay({ delay: 2000, stopOnInteraction: true })]}
                className="w-full"
              >
                  <CarouselContent className="-ml-2">
                      {[...sliderImages, ...sliderImages].map((src, i) => (
                          <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2">
                               <Image src={src} alt={`Capa de conteúdo ${i+1}`} width={200} height={300} className="w-full h-auto object-cover" />
                          </CarouselItem>
                      ))}
                  </CarouselContent>
              </Carousel>
            </div>
            <p className="mb-2 font-semibold">Quero proteger o meu filho agora!</p>
            <Button size="lg" className="w-full md:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleStartQuiz}>Conhecer a plataforma</Button>
          </div>
        );

      case 'quiz':
        const question = quizQuestions[questionIndex];
        return (
          <div className="w-full animate-in fade-in duration-500">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{question.text}</h2>
            <div className="flex flex-col gap-4 mt-8">
              {question.answers.map((answer, i) => (
                <Button 
                  key={i} 
                  variant={selectedAnswer === answer ? "default" : "outline"} 
                  size="lg" 
                  className={cn(
                    "justify-start text-left h-auto py-4 text-base w-full",
                    selectedAnswer === null ? "border-primary/30 hover:border-primary hover:bg-primary/10" :
                    selectedAnswer === answer ? "bg-primary text-primary-foreground" : "border-border/20 text-foreground/70"
                  )} 
                  onClick={() => handleAnswer(answer)}
                >
                  {answer}
                </Button>
              ))}
            </div>
          </div>
        );
      
      case 'reveal':
        return (
            <div className="w-full text-center space-y-8 animate-in fade-in duration-1000">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">🎬 Por isso criamos o SKYFLIX — A Plataforma Cristã Infantil.</h2>
              <div className="aspect-video bg-black overflow-hidden relative shadow-lg">
                  <Image src="https://picsum.photos/seed/vsl/800/450" layout="fill" objectFit="cover" alt="Video Sobre Skyflix"/>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-20 h-20 text-white/80 cursor-pointer hover:text-white transition-colors"/>
                  </div>
              </div>
              <p className="text-lg text-foreground/90 max-w-3xl mx-auto">Uma plataforma segura, com filmes, desenhos, músicas e atividades cristãs criadas para aproximar seu filho de Deus — e afastá-lo das más influências.</p>
              <Button size="lg" onClick={() => setStage('social')}>👀 Ver exemplos do conteúdo da plataforma</Button>
            </div>
        );

      case 'social':
        return (
            <div className="w-full text-center space-y-12 animate-in fade-in duration-1000">
                <h2 className="text-3xl font-bold">O que as famílias estão amando no SKYFLIX:</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-left max-w-3xl mx-auto">
                    {["Filmes e desenhos 3D com personagens da Bíblia", "Historinhas em vídeo e áudio para dormir", "Jogos educativos e atividades bíblicas", "Material para colorir e aprender brincando", "Conteúdo atualizado semanalmente"].map(item => (
                        <li key={item} className="flex items-center gap-3 text-base">
                           <Check className="h-6 w-6 text-secondary flex-shrink-0"/> {item}
                        </li>
                    ))}
                </ul>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="aspect-video bg-black overflow-hidden relative shadow-lg">
                            <Image src={`https://picsum.photos/seed/depoimento${i}/400/225`} layout="fill" objectFit="cover" alt={`Depoimento de família ${i}`}/>
                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="w-16 h-16 text-white/70 cursor-pointer hover:text-white transition-colors"/>
                            </div>
                        </div>
                    ))}
                </div>
                <Button size="lg" onClick={() => setStage('loading')}>💙 Quero garantir o acesso com desconto especial</Button>
            </div>
        );
      
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-center text-foreground/80">⏳ Buscando um cupom de desconto especial pra você…</p>
          </div>
        );

      case 'offer':
        return (
          <div className="text-center animate-in zoom-in-95 duration-500 space-y-6">
            <h2 className="text-3xl font-bold text-primary mb-2">🎉 Parabéns! Você acaba de desbloquear 50% de desconto vitalício na plataforma SKYFLIX.</h2>
            <p className="text-lg text-foreground/80 mb-6">Crie um ambiente seguro e divertido para o seu filho aprender sobre Deus, longe das más influências.</p>
            
            <Card className="bg-card/50 max-w-md mx-auto text-left">
                <CardContent className="p-6">
                    <ul className="space-y-3">
                        {["📺 Filmes e clipes 3D dos personagens da Bíblia", "📖 Historinhas para leitura em família", "🔊 Áudios para dormir com orações guiadas", "🎲 Jogos e atividades educativas", "🎨 Desenhos bíblicos para colorir"].map((item, index) => (
                            <li key={index} className="flex items-center gap-3">{item}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Button size="lg" onClick={() => setIsModalOpen(true)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse">
              Quero Meu Acesso
            </Button>

             <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><Lock className="h-4 w-4"/> 7 dias de garantia ou seu dinheiro de volta.</p>

            <div className="text-left max-w-sm mx-auto space-y-4 pt-6">
                <h3 className="text-lg font-semibold text-center mb-4">Perguntas Frequentes</h3>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold">O acesso é vitalício?</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> Sim.</p>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold">Funciona na TV?</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> Sim, é super fácil!</p>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold">É seguro para todas as idades?</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> 100%!</p>
                </div>
            </div>
          </div>
        );
    }
  };

  const showBackButton = stage === 'quiz' || stage === 'reveal' || stage === 'social';

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center pt-6 sm:pt-10 relative overflow-x-hidden">
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-4 px-4 sm:px-8">
            <header className="w-full flex flex-col items-center gap-4 mb-8">
                <div className="relative w-full flex items-center justify-center">
                   {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-0">
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  )}
                  <Image src="https://skyflix-quiz.vercel.app/images/logo/skyflix-logo.png" alt="Skyflix Logo" width={200} height={50} priority className="mb-4"/>
                </div>
                <Progress value={progress} className="w-full h-2 max-w-md" />
            </header>
            
            <div className="w-full flex-grow flex flex-col items-center justify-center">
              {renderContent()}
            </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 border-primary shadow-[0_0_30px_5px] shadow-primary/30 max-w-sm">
          <div className="p-8 text-center space-y-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <PartyPopper className="text-primary h-6 w-6" />
                Último passo para garantir seu desconto!
              </DialogTitle>
              <p className="text-muted-foreground">Preencha os dados abaixo para acessar a plataforma:</p>
            </DialogHeader>
            <form onSubmit={handleSubmit(onModalSubmit)} className="space-y-4 text-left">
              <div>
                <Input id="name" {...register("name", { required: "Nome é obrigatório" })} placeholder="Seu nome completo"/>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Input id="email" type="email" {...register("email", { required: "E-mail é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "E-mail inválido" } })} placeholder="Seu melhor e-mail" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
               <div>
                <Input id="phone" type="tel" {...register("phone", { required: "Telefone é obrigatório" })} placeholder="Seu WhatsApp (com DDD)" />
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
    </>
  );
}
