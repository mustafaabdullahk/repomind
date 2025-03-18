// Google Analytics tracking utility functions

/**
 * Send a page view event to Google Analytics
 * This is needed for client-side navigation in Next.js
 */
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-DH7ZVCCYD0', {
      page_path: url,
    });
  }
};

/**
 * Track custom events
 */
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}; 