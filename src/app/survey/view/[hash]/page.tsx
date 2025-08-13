import SurveyDetail from '@components/template/SurveyDetail';


interface PageProps {
  params: Promise<{
    hash: string;
  }>;
}
const Page: React.FC<PageProps> = async ({ params }) => {
  const hash = (await params).hash;
  
  return <SurveyDetail hash={hash} />
};

export default Page;
