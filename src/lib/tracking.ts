type EventName =
  | 'start_quiz'
  | 'step_view'
  | 'answer_question'
  | 'open_modal'
  | 'checkout_redirect';

type EventParams = {
  [key: string]: string | number | undefined;
};

// Adicione esta interface para ter um dataLayer tipado, se desejar
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: EventName, params?: EventParams) => {
  console.log(`[Tracking Event]: ${eventName}`, params || '');

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};
