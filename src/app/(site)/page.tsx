import { getUserInformation } from '@api/server/get-user-information';
import Landing from '@components/template/landing/Landing';

export default async function Page() {
  const user = await getUserInformation();

  return <Landing user={user} />;
}
