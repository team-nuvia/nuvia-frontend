export class DateFormat {
  static convert(format: string = 'YYYY-MM-dd HH:mm:ss', baseTime: string | number | Date = new Date()) {
    const base = new Date(baseTime);
    return format.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP|YY|M|d|H|m|s|S/g, (match: string) => {
      switch (match) {
        case 'YYYY':
          return base.getFullYear().toString().padStart(4, '0');
        case 'MM':
          return (base.getMonth() + 1).toString().padStart(2, '0');
        case 'dd':
          return base.getDate().toString().padStart(2, '0');
        case 'HH':
          return base.getHours().toString().padStart(2, '0');
        case 'mm':
          return base.getMinutes().toString().padStart(2, '0');
        case 'ss':
          return base.getSeconds().toString().padStart(2, '0');
        case 'SSS':
          return base.getMilliseconds().toString().padStart(3, '0');
        case 'AP':
          return base.getHours() < 12 ? 'AM' : 'PM';
        case 'YY':
          return base.getFullYear().toString().slice(-2);
        case 'M':
          return (base.getMonth() + 1).toString().padStart(2, '0');
        case 'd':
          return base.getDate().toString().padStart(2, '0');
        case 'H':
          return base.getHours().toString().padStart(2, '0');
        case 'm':
          return base.getMinutes().toString().padStart(2, '0');
        case 's':
          return base.getSeconds().toString().padStart(2, '0');
        case 'S':
          return base.getMilliseconds().toString().padStart(3, '0');
        default:
          return match;
      }
    });
  }

  static getTimeAgo(date: Date) {
    const base = new Date(date);
    const now = new Date();
    const diff = now.getTime() - base.getTime();

    // 2시간(7200초) 이상이면 toUTCOnly 포맷으로 반환
    if (diff >= 7200000) {
      return this.toUTCOnly(base);
    }

    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diff / (1000 * 60));
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else {
      return `${diffInHours}시간 전`;
    }
  }

  static toKSTOnly(date: Date) {
    const base = new Date(date);
    base.setHours(base.getHours() + 9);
    return this.convert('YYYY-MM-dd HH:mm', base);
  }

  static toUTCOnly(date: Date) {
    const base = new Date(date);
    base.setHours(base.getHours());
    return this.convert('YYYY-MM-dd HH:mm', base);
  }

  static toUTC(format: string = 'YYYY-MM-dd HH:mm:ss', date: string | Date | null = null) {
    const base = date ? new Date(date) : new Date();
    return this.convert(format, base);
  }

  static toKST(format: string = 'YYYY-MM-dd HH:mm:ss', date: string | Date | null = null) {
    const base = date ? new Date(date) : new Date();
    base.setHours(base.getHours() + 9);
    return this.convert(format, base);
  }
}
