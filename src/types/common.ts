export type Stage = 'intro' | 'quiz' | 'vsl' | 'testimonials' | 'loading' | 'offer';

export type FormValues = {
  name: string;
  email: string;
  phone: string;
};

export type QuizQuestion = {
  id: number;
  text: string;
  answers: string[];
};

export type TrackingEvent = {
  event_name: string;
  event_data: Record<string, any>;
};