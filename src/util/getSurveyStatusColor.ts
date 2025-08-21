import { SearchSurvey } from '@share/interface/search-survey';

export const getSurveyStatusColor = (status: SearchSurvey['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'warning';
    case 'closed':
      return 'default';
    default:
      return 'default';
  }
};
