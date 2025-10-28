export type QuizQuestion = {
  id: number;
  question: string;
  answers: string[];
  subtext?: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How often do you worry about the content your children are watching on mainstream platforms?",
    answers: ["Frequently, it's a constant concern.", "Sometimes, I find questionable things.", "Rarely, I trust the platforms."],
  },
  {
    id: 2,
    question: "How important is it for you to find entertainment that reinforces your family's Christian values?",
    answers: ["Extremely important, it's non-negotiable.", "Very important, I actively look for it.", "Somewhat important, but options are scarce."],
  },
  {
    id: 3,
    question: "Have you ever felt that modern cartoons and shows for kids promote values contrary to yours?",
    answers: ["Yes, often and it's frustrating.", "Sometimes I notice subtle messages.", "No, I haven't noticed that."],
  },
];
