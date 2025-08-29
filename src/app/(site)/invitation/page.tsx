import Invitation from '@components/template/Invitation';

const Page = async (props: { searchParams: Promise<{ q: string }> }) => {
  const { q } = await props.searchParams;
  return <Invitation token={q} />;
};

export default Page;
