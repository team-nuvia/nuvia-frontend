'use client';

import LoadingContext from '@context/LodingContext';
import { useContext, useLayoutEffect } from 'react';

// TODO: 초대 토큰 받고 로그인 시 바로 초대 승인 처리
// TODO: 초대 토큰 유효성 검사
// TODO: 로그아웃 시 로그인 요청 처리
interface InvitationProps {
  token: string;
}
const Invitation: React.FC<InvitationProps> = ({ token }) => {
  const { endLoading } = useContext(LoadingContext);

  useLayoutEffect(() => {
    endLoading();
  }, []);

  return (
    <div>
      <h1>Invitation</h1>
      <p>{token}</p>
    </div>
  );
};

export default Invitation;
