/**
 * Google Analytics TypeScript 声明
 */

interface Window {
  dataLayer: any[];
  gtag?: (...args: any[]) => void;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export {};