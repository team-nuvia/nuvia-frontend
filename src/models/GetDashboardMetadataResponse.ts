export interface GetDashboardMetadataResponse {
  totalSurveys: number;
  totalRespondents: number;
  averageResponseRate: {
    respondents: number;
    total: number;
  };
  planUsage: {
    used: number;
    total: number;
  };
}
