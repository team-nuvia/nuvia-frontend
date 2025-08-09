export interface GetDashboardMetadataResponse {
  totalSurveyCount: number;
  totalRespondentCount: number;
  respondentIncreaseRate: {
    previousMonthRespondentCount: number;
    currentMonthRespondentCount: number;
  };
  planUsage: {
    plan: string;
    usage: number;
    limit: number;
  };
}
