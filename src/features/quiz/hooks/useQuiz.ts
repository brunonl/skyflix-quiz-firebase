import { useState, useEffect } from 'react';
import { Stage, QuizQuestion } from '@/types/common';
import { trackEvent } from '@/lib/tracking';

interface UseQuizProps {
  questions: QuizQuestion[];
}

export const useQuiz = ({ questions }: UseQuizProps) => {
  const [stage, setStage] = useState<Stage>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = questions.length + 4;
    let currentStep = 0;
    
    if (stage === 'intro') currentStep = 0;
    if (stage === 'quiz') currentStep = questionIndex + 1;
    if (stage === 'vsl') currentStep = questions.length + 1;
    if (stage === 'testimonials') currentStep = questions.length + 2;
    if (stage === 'loading') currentStep = questions.length + 3;
    if (stage === 'offer') currentStep = questions.length + 4;

    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);

    trackEvent('step_view', { 
      step_id: stage, 
      step_number: currentStep, 
      progress: newProgress 
    });
  }, [stage, questionIndex, questions.length]);

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
      question_text: questions[questionIndex].text,
      answer: answer,
    });

    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1);
      } else {
        setStage('vsl');
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
    } else if (stage === 'vsl') {
      setStage('quiz');
      setQuestionIndex(questions.length - 1);
    } else if (stage === 'testimonials') {
      setStage('vsl');
    }
  };

  return {
    stage,
    setStage,
    questionIndex,
    selectedAnswer,
    progress,
    handleStartQuiz,
    handleAnswer,
    handleBack,
    currentQuestion: questions[questionIndex],
  };
};