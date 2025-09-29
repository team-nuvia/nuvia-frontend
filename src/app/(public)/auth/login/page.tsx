import Login from '@components/template/auth/Login';

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}
const Page: React.FC<PageProps> = async ({ searchParams }) => {
  const searchParamData = await searchParams;
  return <Login searchParams={searchParamData} />;
};

export default Page;
