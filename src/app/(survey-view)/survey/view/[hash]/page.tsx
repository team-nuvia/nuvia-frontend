'use server';

import SurveyDetail from '@components/template/survey/SurveyDetail';
import { AxiosError } from 'axios';
import { notFound } from 'next/navigation';
import NotFound from './not-found';
import { getSurveyDetailView } from './utils';

interface PageProps {
  params: Promise<{
    hash: string;
  }>;
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const hash = (await params).hash;
  try {
    const survey = await getSurveyDetailView(hash);
    if (!survey.payload) {
      return notFound();
    }
    return <SurveyDetail survey={survey.payload} />;
  } catch (error: any) {
    const axiosError = error as AxiosError<ServerResponse<void>>;
    console.log('🚀 ~ Page ~ error:', axiosError.response?.data.reason);
    if (axiosError.response?.status === 400) {
      return <NotFound reason={axiosError.response?.data.message} />;
    }

    return notFound();
  }
};

export default Page;
