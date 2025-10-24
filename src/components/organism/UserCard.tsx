import UserDescription from '@components/molecular/UserDescription';
import { Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface UserCardProps {
  name: string;
  caption?: string;
  content: string;
  nameSize?: number;
  profileImage: string | null;
  isVisible?: boolean;
  isLoading?: boolean;
}

const UserCard: React.FC<UserCardProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // 컨테이너 너비가 100px 이하일 때 텍스트 숨김
        setIsVisible(width > 100);
      }
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [containerRef?.current]);

  return (
    <Stack ref={containerRef} width="100%">
      <UserDescription {...props} isVisible={isVisible} isLoading={props.isLoading} />
    </Stack>
  );
};

export default UserCard;
