import { getUsersMe } from '@api/get-users-me';
import { useQuery } from '@tanstack/react-query';

export const useUsersMe = () => {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getUsersMe,
  });
};

export default useUsersMe;
