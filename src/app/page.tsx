"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { quizQuestions, type QuizQuestion } from "@/lib/quiz-data";
import { trackEvent } from "@/lib/tracking";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Loader2, ShieldCheck, HeartHandshake, Sparkles, PlayCircle, Ticket } from "lucide-react";
import { SkyflixLogo } from "@/components/skyflix-logo";

type Stage = 'intro' | 'quiz' | 'solution' | 'loading' | 'offer';

const benefits = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Safe Content",
    description: "100% Christian and family-friendly shows, vetted for your peace of mind.",
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: "Family Values",
    description: "Entertainment that reinforces the values you teach at home.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Inspiring Stories",
    description: "Content that nurtures faith, inspires character, and sparks curiosity.",
  },
];

const testimonials = PlaceHolderImages.filter(img => img.id.includes('testimonial'));

const LoadingMessage = () => {
  const messages = [
    "Analyzing your concerns...",
    "Calculating the best plan for your family...",
    "Your special offer is almost ready!",
  ];
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setCurrentMessage(messages[messageIndex]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return <p className="mt-4 text-lg text-center text-foreground/80">{currentMessage}</p>;
};

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const totalQuestions = quizQuestions.length;

  useEffect(() => {
    if (stage === 'quiz') {
      trackEvent('step_view', { step_id: `question_${questionIndex + 1}` });
    }
  }, [stage, questionIndex]);
  
  useEffect(() => {
    if (stage === 'loading') {
      const timer = setTimeout(() => {
        setStage('offer');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleStartQuiz = () => {
    trackEvent('start_quiz');
    setStage('quiz');
  };

  const handleAnswer = (answer: string) => {
    trackEvent('answer_question', {
      question_id: `question_${questionIndex + 1}`,
      question_text: quizQuestions[questionIndex].question,
      answer: answer,
    });
    setAnswers(prev => [...prev, answer]);
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      trackEvent('reveal_solution');
      setStage('solution');
    }
  };
  
  const handleCheckoutRedirect = () => {
    trackEvent('checkout_redirect');
    window.location.href = "https://kiwify.com.br"; // Placeholder URL
  }

  const renderContent = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="text-center animate-in fade-in duration-500">
            <SkyflixLogo className="h-16 mb-8" />
            <h1 className="text-4xl font-bold tracking-tight mb-4">Is your family's screen time safe and sound?</h1>
            <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
              Find out if your children are truly protected. Take our 3-question quiz to diagnose your family's emotional needs.
            </p>
            <Button size="lg" onClick={handleStartQuiz}>Start The Quiz</Button>
          </div>
        );

      case 'quiz':
        const question = quizQuestions[questionIndex];
        return (
          <div className="w-full animate-in fade-in duration-500">
            <Progress value={((questionIndex + 1) / totalQuestions) * 100} className="w-full mb-8" />
            <h2 className="text-3xl font-semibold text-center mb-4">{question.question}</h2>
            {question.subtext && <p className="text-center text-muted-foreground mb-8">{question.subtext}</p>}
            <div className="flex flex-col gap-4 mt-8">
              {question.answers.map((answer, i) => (
                <Button key={i} variant="outline" size="lg" className="justify-start py-6 text-base" onClick={() => handleAnswer(answer)}>
                  {answer}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="w-full text-center space-y-16 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-accent">Your Concern Is Valid. The Digital World Is A Minefield.</h2>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto">But there is a safe harbor. Introducing...</p>
              <SkyflixLogo className="h-20 mx-auto" />
              <p className="text-xl text-foreground/90 max-w-3xl mx-auto">The streaming service that protects your children's hearts and minds with 100% Christian content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {benefits.map(benefit => (
                <div key={benefit.title} className="flex flex-col items-center md:items-start text-center md:text-left gap-4 p-4 rounded-lg">
                  {benefit.icon}
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-foreground/80">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Loved by Families Like Yours</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, i) => (
                  <Card key={testimonial.id} className="bg-card/70 border-border/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image src={testimonial.imageUrl} alt={testimonial.description} width={600} height={400} data-ai-hint={testimonial.imageHint} className="w-full object-cover aspect-video" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                          <PlayCircle className="w-16 h-16 text-white/70" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="italic">"Skyflix has been a blessing. I can finally let my kids watch TV without worrying."</p>
                        <p className="font-semibold mt-2">- The {['Johnson', 'Smith', 'Miller'][i]} Family</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Button size="lg" onClick={() => {
              trackEvent('reveal_discount');
              setStage('loading');
            }}>
              Unlock My Special Offer
            </Button>
          </div>
        );

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-500">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <LoadingMessage />
          </div>
        );

      case 'offer':
        return (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <h2 className="text-4xl font-bold text-primary mb-2">Congratulations!</h2>
            <p className="text-xl text-foreground/80 mb-8">You've unlocked a special discount for your family.</p>
            
            <div className="relative my-12 p-8 border-2 border-dashed border-accent rounded-xl bg-card/50 max-w-md mx-auto">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background px-4">
                <Ticket className="h-12 w-12 text-accent rotate-[-20deg]" />
              </div>
              <p className="text-lg">Your Exclusive Offer</p>
              <p className="text-6xl font-bold my-2 text-primary">50% OFF</p>
              <p className="text-lg">For your first 3 months!</p>
              <p className="text-sm text-muted-foreground mt-4">CODE: FAMILYFIRST</p>
            </div>
            
            <p className="text-lg text-foreground/80 mb-6">Click below to claim your discount and start your 7-day free trial.</p>
            
            <Button size="lg" onClick={handleCheckoutRedirect} className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 transform hover:scale-105 transition-transform">
              Claim My 50% Discount Now
            </Button>
            <p className="text-sm text-muted-foreground mt-4">You'll be redirected to our secure checkout on Kiwify.</p>
          </div>
        );
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </main>
  );
}
