import SurveyDetail from '@components/template/SurveyDetail';
import { notFound } from 'next/navigation';
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
  } catch (error) {
    console.log('🚀 ~ Page ~ error:', error);
    return notFound();
  }
};

export default Page;
