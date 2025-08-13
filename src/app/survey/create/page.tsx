import Survey from '@components/template/Survey';

export default async function SurveyPage({ searchParams }: { searchParams: Promise<{ edit: string }> }) {
  const edit = (await searchParams).edit;

  return <Survey id={edit} />;
}
