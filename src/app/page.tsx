"use client";

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";

// Função utilitária para tocar áudio
function playSound(src: string) {
  const audio = new window.Audio(src);
  audio.volume = 0.7;
  audio.play();
}
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
import { cn } from "@/lib/utils";
import { useMusic } from "@/app/layout";

type Stage = 'intro' | 'quiz' | 'reveal' | 'social' | 'loading' | 'offer';
type FormValues = { name: string; email: string; phone: string; };

const quizQuestions = [
  { id: 1, text: "Você acredita que o conteúdo que seu filho consome hoje pode influenciar o comportamento dele no futuro?", answers: ["A. Com certeza, e isso me preocupa.", "B. Sim, mas é difícil controlar tudo.", "C. Talvez, nunca pensei nisso.", "D. Não tenho certeza."] },
  { id: 2, text: "Você já sentiu medo de deixar seu filho sozinho com o celular ou YouTube?", answers: ["A. Sim, o tempo todo.", "B. Sim, mas tento monitorar.", "C. Às vezes, depende do conteúdo."] },
  { id: 3, text: "E se você pudesse oferecer um ambiente 100% seguro, com desenhos e histórias que ensinam valores cristãos, você usaria?", answers: ["A. Sim, com certeza!", "B. Sim, se fosse fácil de usar.", "C. Talvez, depende do conteúdo."] },
  { id: 4, text: "Qual dessas opções mais representa o que você quer pro seu filho?", answers: ["A. Um ambiente seguro e sem influências ruins.", "B. Um conteúdo que ensine valores cristãos de forma divertida.", "C. Algo que estimule a criatividade e a fé ao mesmo tempo.", "D. Todas as opções acima."] },
];

const sliderImages = [
  "/images/h1.png",
  "/images/h3.png",
  "/images/h4.png",
  "/images/h5.png",
  "/images/h6.png",
  "/images/h7.png",
  "/images/h9.png",
  "/images/h10.png",
  "/images/h11.png",
]; // Caminhos já estão corretos para pasta public

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isMuted, toggleMute } = useMusic();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const totalSteps = quizQuestions.length + 4;
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
    if (stage === 'offer') {
      playSound('/music/win.mp3'); // Som ao ganhar desconto
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
    playSound('/music/step.mp3'); // Som ao avançar etapa
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

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    sliderRef.current.classList.add('grabbing');
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (!sliderRef.current) return;
    setIsDown(false);
    sliderRef.current.classList.remove('grabbing');
  };

  const handleMouseUp = () => {
    if (!sliderRef.current) return;
    setIsDown(false);
    sliderRef.current.classList.remove('grabbing');
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // O multiplicador acelera a rolagem
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDown(false);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDown || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="text-center animate-in fade-in duration-500 w-full flex flex-col items-center">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight mb-4 max-w-3xl mx-auto text-tertiary">
              Enquanto você trabalha, a internet educa.
            </h1>
            <p className="text-base sm:text-lg md:text-3xl font-medium text-white mb-4 max-w-3xl mx-auto">
              O que seu filho está assistindo hoje...<br />Pode moldar quem ele será amanhã.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 max-w-3xl mx-auto">
              O <strong className="text-tertiary">SKYFLIX</strong> foi criado pra mudar isso, uma plataforma cristã segura, com <strong className="text-tertiary">conteúdos cuidadosamente selecionados</strong> de forma criteriosa, que ensinam sobre Deus de um jeito leve, divertido e livre de influências ruins.
            </p>
            <p className="mb-2 font-semibold text-white">💙 Quero proteger o meu filho agora!</p>
            <Button size="lg" className="w-full md:w-auto mb-10 animate-zoom-pulse bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleStartQuiz}>Conhecer a plataforma</Button>

            <div className="w-full relative mb-[60px]">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <div 
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className="w-full overflow-x-auto cursor-grab hide-scrollbar"
              >
                <div className="flex w-max scrolling-wrapper select-none">
                  {[...sliderImages, ...sliderImages].map((src, i) => (
                    <div key={i} className="w-[200px] h-[300px] flex-shrink-0 px-2">
                      <Image src={src} alt={`Capa de conteúdo ${i+1}`} width={200} height={300} className="w-full h-full object-cover pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        const question = quizQuestions[questionIndex];
        return (
          <div className="w-full animate-in fade-in duration-500">
            <h2 className="text-lg sm:text-xl md:text-3xl font-semibold text-center mb-8">{question.text}</h2>
            <div className="flex flex-col gap-4 mt-8">
              {question.answers.map((answer, i) => (
                <Button 
                  key={i} 
                  variant="outline"
                  size="lg" 
                  className={cn(
                    "justify-start text-left h-auto py-4 text-sm sm:text-base w-full bg-card/50 border-border text-foreground/80 hover:bg-primary/20 hover:border-primary hover:text-foreground whitespace-normal",
                    selectedAnswer === answer && "bg-primary/20 text-foreground border-primary" 
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
          <div className="text-center animate-in zoom-in-95 duration-500 space-y-6 max-w-3xl mx-auto pb-8 sm:pb-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">🎉 Parabéns! Seu cupom de desconto foi ativado com sucesso!</h2>
            <p className="text-base sm:text-lg text-foreground/80 mb-6">
              Você acaba de garantir 50% de desconto vitalício no acesso à ✨ SKYFLIX – A Plataforma Cristã Infantil.
              <br/>
              Agora o seu filho pode aprender sobre Deus brincando, em um ambiente seguro e livre de más influências — com um investimento único e vitalício.
            </p>
            
            <Card className="bg-card/70 border-primary/50 shadow-lg shadow-primary/10 max-w-md mx-auto text-center py-4">
                <CardContent className="p-2">
                    <p className="text-md sm:text-lg text-foreground/80">🕊️ De <span className="line-through">R$99,00</span> → por apenas</p>
                    <p className="text-3xl sm:text-4xl font-bold text-white my-1">R$47,90</p>
                    <p className="text-xs sm:text-sm text-foreground/70">💙 (Desconto vitalício aplicado automaticamente pelo seu cupom)</p>
                </CardContent>
            </Card>

            <div className="space-y-4 pt-4 text-sm sm:text-base">
              <div className="bg-card/50 border border-border/50 p-4 rounded-lg text-left">
                  <p className="font-semibold text-sm sm:text-base">🔥 Atividades e Jogos Bíblicos Extras</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">+100 novos desafios interativos por apenas R$14,90</p>
              </div>
              <div className="bg-card/50 border border-border/50 p-4 rounded-lg text-left">
                  <p className="font-semibold text-sm sm:text-base">🙏 Guia de Orações Diárias para Crianças</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Conteúdo digital exclusivo, por apenas R$14,90</p>
              </div>
            </div>

            <Button size="lg" onClick={() => setIsModalOpen(true)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse mt-8">
              Quero Meu Acesso
            </Button>

             <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground"><Lock className="h-4 w-4"/> 7 dias de garantia ou seu dinheiro de volta.</p>

            <div className="text-left max-w-sm mx-auto space-y-4 pt-6 pb-8">
                <h3 className="text-lg font-semibold text-center mb-4">Perguntas Frequentes</h3>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold text-sm">O acesso é vitalício?</p>
                  <p className="flex items-center gap-2 text-muted-foreground text-sm"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> Sim.</p>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold text-sm">Funciona na TV?</p>
                  <p className="flex items-center gap-2 text-muted-foreground text-sm"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> Sim, é super fácil!</p>
                </div>
                <div className="border-t border-border/50 pt-2">
                  <p className="font-semibold text-sm">É seguro para todas as idades?</p>
                  <p className="flex items-center gap-2 text-muted-foreground text-sm"><Check className="text-secondary h-4 w-4 flex-shrink-0"/> 100%!</p>
                </div>
            </div>
          </div>
        );
    }
  };

  const showBackButton = stage === 'quiz' || stage === 'reveal' || stage === 'social';

  return (
    <>
      <style jsx global>{`
        @keyframes zoom-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-zoom-pulse {
          animation: zoom-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .grabbing {
          cursor: grabbing;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      <main className="flex min-h-screen w-full flex-col items-center pt-4 sm:pt-5 relative overflow-x-hidden">
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-4 px-4 sm:px-8">
            <header className="w-full flex flex-col items-center gap-2 mb-4 sm:gap-4 sm:mb-8">
                <div className="relative w-full flex items-center justify-center">
                   {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-0 bg-primary/10 hover:bg-primary/20">
                      <ChevronLeft className="h-6 w-6 text-primary/70" />
                    </Button>
                  )}
                  <Image src="/images/logo/skyflix-logo.png" alt="Skyflix Logo" width={200} height={50} priority className="mb-2 sm:mb-4"/>
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
