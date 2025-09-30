import { SurveyGraphType } from '@share/enums/survey-graph-type';
import { snapApi } from '../index';

export interface DailyResponseCountResponse {
  date: string;
  count: number;
}

/**
 * 특정 기간 동안의 일별 응답 수를 가져옵니다.
 * @param startDate - 시작 날짜 (YYYY-MM-DD 형식)
 * @param endDate - 종료 날짜 (YYYY-MM-DD 형식)
 * @returns 일별 응답 수 데이터
 */
export const getDailyResponseCount = async (startDate: string, endDate: string): Promise<ServerResponse<DailyResponseCountResponse[]>> => {
  const response = await snapApi.get('/surveys/graph/respondent', {
    params: {
      startDate,
      endDate,
      type: SurveyGraphType.Weekly,
    },
  });
  return response.data;
};

/**
 * 최근 7일간의 일별 응답 수를 가져옵니다.
 * @returns 최근 7일간의 일별 응답 수 데이터
 */
export const getLast7DaysResponseCount = async (): Promise<ServerResponse<DailyResponseCountResponse[]>> => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const startDate = sevenDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식

  return getDailyResponseCount(startDate, endDate);
};
