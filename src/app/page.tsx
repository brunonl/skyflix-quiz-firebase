"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { trackEvent } from "@/lib/tracking";
import { Loader2, Play, Check, Lock, ChevronLeft } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ImageSlider } from "@/components/image-slider";
import { Quiz } from "@/components/quiz";
import { OfferModal } from "@/components/offer-modal";

type Stage = 'intro' | 'quiz' | 'reveal' | 'social' | 'loading' | 'offer';
type FormValues = { name: string; email: string; phone: string; };

const quizQuestions = [
	{ id: 1, text: "Você acredita que o conteúdo que seu filho consome hoje pode influenciar o comportamento dele no futuro?", answers: ["A. Com certeza, e isso me preocupa.", "B. Sim, mas é difícil controlar tudo.", "C. Talvez, nunca pensei nisso.", "D. Não tenho certeza."] },
	{ id: 2, text: "Você já sentiu medo de deixar seu filho sozinho com o celular ou YouTube?", answers: ["A. Sim, o tempo todo.", "B. Sim, mas tento monitorar.", "C. Às vezes, depende do conteúdo."] },
	{ id: 3, text: "E se você pudesse oferecer um ambiente 100% seguro, com desenhos e histórias que ensinam valores cristãos, você usaria?", answers: ["A. Sim, com certeza!", "B. Sim, se fosse fácil de usar.", "C. Talvez, depende do conteúdo."] },
	{ id: 4, text: "Qual dessas opções mais representa o que você quer pro seu filho?", answers: ["A. Um ambiente seguro e sem influências ruins.", "B. Um conteúdo que ensine valores cristãos de forma divertida.", "C. Algo que estimule a criatividade e a fé ao mesmo tempo.", "D. Todas as opções acima."] },
];

const sliderImages = [
	"/images/capas/h1.png",
	"/images/capas/h3.png",
	"/images/capas/h4.png",
	"/images/capas/h5.png",
	"/images/capas/h6.png",
	"/images/capas/h7.png",
	"/images/capas/h9.png",
	"/images/capas/h10.png",
	"/images/capas/h11.png",
];

export default function Home() {
	const [stage, setStage] = useState<Stage>('intro');
	const [questionIndex, setQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const form = useForm<FormValues>();
	const { register, handleSubmit, formState: { errors } } = form;


	useEffect(() => {
		const totalSteps = quizQuestions.length + 4;
		let currentStep = 0;
		if (stage === 'intro') currentStep = 0;
		if (stage === 'quiz') currentStep = questionIndex + 1;
		if (stage === 'reveal') currentStep = quizQuestions.length + 1;
		if (stage === 'social') currentStep = quizQuestions.length + 2;
		if (stage === 'loading') currentStep = quizQuestions.length + 3;
		if (stage === 'offer') currentStep = quizQuestions.length + 4;

		const newProgress = (currentStep / totalSteps) * 100;
		setProgress(newProgress);

		trackEvent('step_view', { step_id: stage, step_number: currentStep, progress: newProgress });
	}, [stage, questionIndex]);

	useEffect(() => {
		if (stage === 'loading') {
			const timer = setTimeout(() => {
				setStage('offer');
			}, 5000);
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
				return (
					<div className="text-center animate-in fade-in duration-500 w-full flex flex-col items-center">
						<h1 className="text-2xl sm:text-2xl md:text-4xl font-bold mb-4 max-w-3xl mx-auto text-primary">
							Enquanto você trabalha, a internet educa.
						</h1>
						<p className="text-base sm:text-lg md:text-3xl font-medium mb-4 max-w-3xl mx-auto text-white">
							O que seu filho está assistindo hoje...<br />Pode moldar quem ele será amanhã.
						</p>
						<p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 max-w-3xl mx-auto">
							O <strong className="text-tertiary">SKYFLIX</strong> foi criado pra mudar isso, uma plataforma cristã segura, com <strong className="text-tertiary">conteúdos cuidadosamente selecionados</strong> de forma criteriosa, que ensinam sobre Deus de um jeito leve, divertido e livre de influências ruins.
						</p>
						<p className="mb-2 font-semibold text-white">💙 Quero proteger o meu filho agora!</p>
						<Button size="lg" className="w-full md:w-auto mb-10 animate-zoom-pulse bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleStartQuiz}>Conhecer a plataforma</Button>

						<ImageSlider images={sliderImages} />
					</div>
				);

			case 'quiz':
				return (
					<Quiz question={quizQuestions[questionIndex]} selectedAnswer={selectedAnswer} onAnswer={handleAnswer} />
				);

			case 'reveal':
				return (
					<div className="w-full text-center space-y-8 animate-in fade-in duration-1000">
						<h2 className="text-3xl md:text-4xl font-bold">Por isso criamos o SKYFLIX!</h2>
						<p className="text-lg text-primary font-semibold">Assista o vídeo abaixo!</p>
						<div className="aspect-video bg-black overflow-hidden relative shadow-lg">
							<Image src="https://picsum.photos/seed/vsl/800/450" layout="fill" objectFit="cover" alt="Video Sobre Skyflix" />
							<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
								<Play className="w-20 h-20 text-white/80 cursor-pointer hover:text-white transition-colors" />
							</div>
						</div>
						<Button size="lg" onClick={() => setStage('social')}>Veja o que as famílias estão dizendo</Button>
					</div>
				);

			case 'social':
				return (
					<div className="w-full text-center space-y-5 animate-in fade-in duration-1000">
						<h2 className="text-2xl font-bold">O que as famílias estão dizendo sobre o SKYFLIX</h2>
						<p className="text-lg text-primary font-semibold">Assista os depoimentos abaixo!</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							{[1, 2].map(i => (
								<div key={i} className="aspect-video bg-black overflow-hidden relative shadow-lg">
									<Image src={`https://picsum.photos/seed/depoimento${i}/400/225`} layout="fill" objectFit="cover" alt={`Depoimento de família ${i}`} />
									<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
										<Play className="w-16 h-16 text-white/70 cursor-pointer hover:text-white transition-colors" />
									</div>
								</div>
							))}
						</div>
						<Button size="lg" onClick={() => setStage('loading')} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse">Quero garantir meu acesso com desconto!</Button>
					</div>
				);

			case 'loading':
				return (
					<div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
						<Loader2 className="h-16 w-16 animate-spin text-primary mt-5" />
						<p className="mt-4 text-lg text-center text-foreground/80">⏳ Buscando um cupom de desconto especial pra você…</p>
					</div>
				);

			case 'offer':
				return (
					<div className="text-center animate-in zoom-in-95 duration-500 space-y-6 max-w-3xl mx-auto pb-8 sm:pb-16">
						<h2 className="text-2xl sm:text-4xl font-bold text-primary mb-2">🎉 Parabéns! Seu cupom foi ativado!</h2>
						<p className="text-base sm:text-lg text-foreground/80 mb-6">
							Agora seu filho pode aprender sobre Deus brincando, em um ambiente seguro e livre de más influências com um investimento único e vitalício.
						</p>

						<Card className="bg-card/70 border border-primary/50 max-w-md mx-auto text-center py-4">
							<CardContent className="p-2 sm:p-4">
								<p className="text-lg sm:text-xl font-bold text-secondary">✨ 50% DE DESCONTO VITALÍCIO ✨</p>
								<p className="text-md sm:text-lg text-foreground/80 mt-2">De <span className="line-through">R$99,00</span> por apenas:</p>
								<p className="text-4xl sm:text-5xl font-bold text-white my-1">R$47,90</p>
								<p className="text-xs sm:text-sm text-foreground/70">💙 (Pagamento único, acesso para sempre)</p>
							</CardContent>
						</Card>

						<div className="space-y-3 pt-4 text-sm sm:text-base">
							<div className="bg-card/50 border border-border/50 p-3 rounded-lg text-left">
								<p className="font-semibold text-base sm:text-lg">🎨 Super Kit de Desenhos para Colorir</p>
								<p className="text-sm sm:text-base text-muted-foreground">+200 desenhos para colorir por apenas R$14,90</p>
							</div>
							<div className="bg-card/50 border border-border/50 p-3 rounded-lg text-left">
								<p className="font-semibold text-base sm:text-lg">🏆 Super Kit de Jogos e Atividades Bíblicas</p>
								<p className="text-sm sm:text-base text-muted-foreground">Vários jogos e atividades por apenas R$14,90</p>
							</div>
						</div>

						<Button size="lg" onClick={() => setIsModalOpen(true)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 w-full md:w-auto animate-pulse mt-8">
							Comprar agora com desconto!
						</Button>

						<div className="w-full pt-8">
							<h3 className="text-lg font-semibold mb-6">Perguntas Frequentes</h3>
							<Accordion type="multiple" defaultValue={["faq1"]} className="w-full flex flex-col gap-4">
								<AccordionItem value="faq1" className="border bg-card/60">
									<AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">Onde posso assistir?</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-left px-4 pb-4">Assista onde quiser, quando quiser. Faça login com sua conta para começar a assistir no computador ou em qualquer aparelho como Smart TVs, smartphones, tablets, aparelhos de streaming e videogames. Você também pode baixar os seus episódios favoritos com iOS, Android ou Windows 10. Use downloads para levar a Skyflix para onde quiser sem precisar de conexão com a Internet.</AccordionContent>
								</AccordionItem>
								<AccordionItem value="faq2" className="border bg-card/60">
									<AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">Como será disponibilizado o meu acesso à plataforma?</AccordionTrigger>
									<AccordionContent className="text-muted-foreground text-left px-4 pb-4">Após a confirmação do pagamento, o acesso à plataforma será imediatamente liberado. Você receberá um e-mail contendo o link de acesso para baixar o aplicativo, além de seu login e senha exclusivos.</AccordionContent>
								</AccordionItem>
								<AccordionItem value="faq3" className="border bg-card/60">
									<AccordionTrigger className="text-base font-semibold px-4 py-4 text-left">Para quais idades o skyflix é voltado?</AccordionTrigger>
									<AccordionContent className="text-muted-foreground px-4 text-left pb-4">Nosso conteúdo é voltado para crianças de 1 a 10 anos</AccordionContent>
								</AccordionItem>
							</Accordion>
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
