export const DeviceType = {
  Mobile: 'Mobile',
  Desktop: 'Desktop',
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];

export const detectUserDevice = (): DeviceType => {
  const userAgent = navigator.userAgent;
  const isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  if (isMobile) {
    return DeviceType.Mobile;
  } else {
    return DeviceType.Desktop;
  }
};
