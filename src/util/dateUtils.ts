import dayjs from 'dayjs';

/**
 * 오늘을 기준으로 지난 7일간의 날짜 배열을 반환합니다.
 * @returns 7일간의 날짜 배열 (오늘부터 6일 전까지)
 */
export const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    dates.push(date.format('MM/DD'));
  }
  return dates;
};

/**
 * 오늘을 기준으로 지난 7일간의 날짜 객체 배열을 반환합니다.
 * @returns 7일간의 날짜 객체 배열 (date: YYYY-MM-DD, label: MM/DD)
 */
export const getLast7DaysWithLabels = (): Array<{ date: string; label: string }> => {
  const dates: Array<{ date: string; label: string }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    dates.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format('MM/DD'),
    });
  }
  return dates;
};

/**
 * 특정 날짜가 오늘로부터 며칠 전인지 계산합니다.
 * @param targetDate - 대상 날짜 (YYYY-MM-DD 형식)
 * @returns 오늘로부터 며칠 전인지 (0이면 오늘, 1이면 어제)
 */
export const getDaysAgo = (targetDate: string | Date): number => {
  const today = dayjs().startOf('day');
  const target = dayjs(targetDate).startOf('day');
  return today.diff(target, 'day');
};

/**
 * 오늘을 기준으로 한 주의 시작일과 종료일을 반환합니다.
 * @returns { startDate: YYYY-MM-DD, endDate: YYYY-MM-DD }
 */
export const getCurrentWeekRange = (): { startDate: string; endDate: string } => {
  const today = dayjs();
  const startDate = today.subtract(6, 'day').format('YYYY-MM-DD');
  const endDate = today.format('YYYY-MM-DD');

  return { startDate, endDate };
};
