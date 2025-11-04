import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuizQuestion {
  id: number;
  text: string;
  answers: string[];
}

interface QuizProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ question, selectedAnswer, onAnswer }) => (
  <div className="w-full animate-in fade-in duration-500">
    <h2 className="text-lg sm:text-xl md:text-3xl font-semibold text-center mb-8">{question.text}</h2>
    <div className="flex flex-col gap-4 mt-8">
      {question.answers.map((answer, i) => (
        <Button 
          key={i} 
          variant="outline"
          size="lg" 
          className={cn(
            "justify-start text-left h-auto py-4 text-sm sm:text-base w-full bg-card/50 border-primary/30 text-foreground/80 hover:bg-primary/20 hover:border-primary hover:text-foreground whitespace-normal",
            selectedAnswer === answer ? "bg-primary/20 text-foreground border-primary" : ""
          )} 
          onClick={() => onAnswer(answer)}
        >
          {answer}
        </Button>
      ))}
    </div>
  </div>
);
