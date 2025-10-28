type EventName =
  | 'start_quiz'
  | 'step_view'
  | 'answer_question'
  | 'reveal_solution'
  | 'reveal_discount'
  | 'checkout_redirect';

type EventParams = {
  [key: string]: string | number | undefined;
};

export const trackEvent = (eventName: EventName, params?: EventParams) => {
  console.log(`[Tracking Event]: ${eventName}`, params || '');

  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};
