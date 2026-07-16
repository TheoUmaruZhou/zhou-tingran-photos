/**
 * 性能监控和分析工具
 */

// Google Analytics 测量ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // 请替换为你的实际测量ID

// 初始化 Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // 加载 Google Analytics 脚本
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // 初始化 gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  // 使 gtag 在全局可用
  (window as any).gtag = gtag;
};

// 跟踪页面浏览
export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

// 跟踪自定义事件
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 跟踪图片查看
export const trackPhotoView = (photoId: string, photoTitle: string) => {
  trackEvent('view_photo', 'engagement', `${photoId} - ${photoTitle}`);
};

// 跟踪图片切换
export const trackPhotoNavigation = (direction: 'next' | 'prev') => {
  trackEvent('navigate_photo', 'engagement', direction);
};

// 跟踪下载
export const trackDownload = (photoId: string, photoTitle: string) => {
  trackEvent('download_photo', 'engagement', `${photoId} - ${photoTitle}`);
};

// 跟踪分享
export const trackShare = (photoId: string) => {
  trackEvent('share_photo', 'engagement', photoId);
};

// 跟踪点赞
export const trackLike = (photoId: string) => {
  trackEvent('like_photo', 'engagement', photoId);
};

// Web Vitals 性能监控
export const reportWebVitals = (metric: any) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  // 发送到 Google Analytics
  (window as any).gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
  });

  // 也可以发送到其他分析服务
  console.log(`[Web Vitals] ${metric.name}:`, metric.value);
};