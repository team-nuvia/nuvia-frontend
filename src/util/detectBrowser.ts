export const BrowserType = {
  Firefox: 'Firefox',
  Chrome: 'Chrome',
  Safari: 'Safari',
  Edge: 'Edge',
  Opera: 'Opera',
  IE: 'IE',
  Other: 'Other',
} as const;
export type BrowserType = (typeof BrowserType)[keyof typeof BrowserType];

export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes(BrowserType.Firefox)) {
    return BrowserType.Firefox;
  } else if (userAgent.includes(BrowserType.Chrome)) {
    return BrowserType.Chrome;
  } else if (userAgent.includes(BrowserType.Safari)) {
    return BrowserType.Safari;
  } else if (userAgent.includes(BrowserType.Edge)) {
    return BrowserType.Edge;
  } else if (userAgent.includes(BrowserType.Opera)) {
    return BrowserType.Opera;
  } else if (userAgent.includes('MSIE') || userAgent.includes(BrowserType.IE) || userAgent.includes('Trident')) {
    return BrowserType.IE;
  } else {
    return BrowserType.Other;
  }
};
