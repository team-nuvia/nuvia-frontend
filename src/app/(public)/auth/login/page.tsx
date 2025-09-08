import Login from '@components/template/Login';

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}
const Page: React.FC<PageProps> = async ({ searchParams }) => {
  const { action, token, redirect } = await searchParams;
  return <Login action={action} token={token} redirect={redirect} />;
};

export default Page;
