import { GetDashboardMetadataResponse, GetSurveyMetadataResponse } from '@/models/GetSurveyMetadataResponse';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { serverApi } from '.';

type StatusCondition<T> = T extends 'surveyList' ? GetSurveyMetadataResponse : T extends 'dashboard' ? GetDashboardMetadataResponse : never;

export const getSurveyMetadataServer = async <T extends MetadataStatusType>(status: T): Promise<ServerResponse<StatusCondition<T>>> => {
  const queryString = new URLSearchParams({ status });
  const response = await serverApi.get<ServerResponse<StatusCondition<T>>>(
    `/surveys/metadata${queryString.toString() ? '?' + queryString.toString() : ''}`,
  );
  return response.data;
};
