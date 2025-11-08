"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { IntroSection } from "@/features/intro/components/IntroSection";
import { VSLSection } from "@/features/vsl/components/VSLSection";
import { Quiz } from "@/components/quiz";
import { OfferModal } from "@/components/offer-modal";
import { useQuiz } from "@/features/quiz/hooks/useQuiz";
import { useFormTracking } from "@/hooks/useFormTracking";
import { quizQuestions } from "@/constants/quiz-data";
import { TestimonialsSection } from "@/features/testimonials/components/TestimonialsSection";
import { OfferSection } from "@/features/offer/components/OfferSection";

import { Stage, FormValues } from '@/types/common';
import { SubmitHandler } from "react-hook-form";



export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm<FormValues>();
  const { formState: { errors } } = form;
  const { handleSubmit } = useFormTracking();
  
  const { 
    stage, 
    progress, 
    selectedAnswer,
    handleStartQuiz,
    handleAnswer,
    handleBack,
    currentQuestion,
    setStage 
  } = useQuiz({ questions: quizQuestions });





	const onModalSubmit: SubmitHandler<FormValues> = (data) => {

		// 1. LIMPEZA E NORMALIZAÇÃO DE DADOS PARA META CAPI

		// Remove a máscara, parênteses, espaços e traços do telefone
		const rawPhone = data.phone.replace(/\D/g, '');

		// Prefixar com '55' (Brasil) para formar o formato E.164 (Ex: 5511988887777)
		// Isso é essencial para o Meta CAPI.
		const normalizedPhone = `55${rawPhone}`;

		// 2. FUNÇÃO DE REDIRECIONAMENTO COM DELAY (EVENT CALLBACK)
		const kiwifyRedirect = () => {
			// Redirecionamento original
			window.location.href = "https://pay.kiwify.com.br/0nFE1EN";
		};

		// 3. ENVIO DE DADOS LIMPOS PARA O GOOGLE TAG MANAGER (dataLayer)

		// Garante que o dataLayer existe
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			'event': 'form_submit_precheckout', // Acionador para o GTM

			// Dados do usuário limpos e normalizados
			'user_name': data.name,
			'user_email': data.email.toLowerCase().trim(), // Normalização de Email
			'user_phone': normalizedPhone, // Telefone no formato E.164

			// GTM só executa a função kiwifyRedirect DEPOIS que as tags dispararem.
			'eventCallback': kiwifyRedirect,

			// Tempo máximo de espera de 2 segundos.
			'eventTimeout': 2000
		});

	};


  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return <IntroSection onStart={handleStartQuiz} />;
      
      case 'quiz':
        return (
          <Quiz 
            question={currentQuestion} 
            selectedAnswer={selectedAnswer} 
            onAnswer={handleAnswer} 
          />
        );
      
      case 'vsl':
        return <VSLSection onNext={() => setStage('testimonials')} />;
      
      case 'testimonials':
        return <TestimonialsSection onNext={() => setStage('loading')} />;
      
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
            <Loader2 className="h-16 w-16 animate-spin text-primary mt-5" />
            <p className="mt-4 text-lg text-center text-foreground/80">
              ⏳ Buscando um cupom de desconto especial pra você…
            </p>
          </div>
        );
      
      case 'offer':
        return <OfferSection onOpenModal={() => setIsModalOpen(true)} />;
    }
  };

	const showBackButton = stage === 'quiz' || stage === 'vsl' || stage === 'testimonials';

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
				<div className="w-full max-w-4xl flex flex-col items-center gap-2 sm:gap-4 px-4 sm:px-8 pb-12">
					<header className="w-full flex flex-col items-center gap-2 mb-4 sm:gap-4 sm:mb-8">
						<div className="relative w-full flex items-center justify-center">
							{showBackButton && (
								<Button variant="ghost" size="icon" onClick={handleBack} className="absolute left-0 bg-primary/10 hover:bg-primary/20">
									<ChevronLeft className="h-6 w-6 text-primary/70" />
								</Button>
							)}
							<Image src="/images/logo/skyflix-logo.png" alt="Skyflix Logo" width={180} height={36} priority className="mb-2 sm:mb-4 lg:w-[200px] lg:h-auto" />
						</div>
						<Progress value={progress} className="w-full h-2 max-w-md" />
					</header>

					<div className="w-full flex-grow flex flex-col items-center justify-center">
						{renderContent()}
					</div>
				</div>
			</main>

			<OfferModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} form={form} onSubmit={onModalSubmit} errors={errors} />
		</>
	);
}
