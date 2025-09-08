import Analysis from '@components/template/Analysis';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <Analysis params={{ surveyId: resolvedParams.id }} />;
}
