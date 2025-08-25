export interface GetDashboardMetadataResponse {
  totalSurveyCount: number;
  totalRespondentCount: number;
  // respondentIncreaseRate: {
  //   previousMonthRespondentCount: number;
  //   currentMonthRespondentCount: number;
  // };
  totalCompletedRespondentCount: number;
  // currentMonthRespondentCount: number;
  planUsage: {
    plan: string;
    usage: number;
    limit: number;
  };
}

export interface GetSurveyMetadataResponse {
  totalSurveyCount: number;
  totalRespondentCount: number;
  activeSurveyCount: number;
  totalViewCount: number;
}
