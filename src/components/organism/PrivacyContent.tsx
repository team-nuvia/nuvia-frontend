'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';

interface PrivacyContentProps {}
const PrivacyContent: React.FC<PrivacyContentProps> = () => {
  const theme = useTheme();

  return (
    <Fragment>
      {/* 헤더 */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.primary.main,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          개인정보처리방침
        </Typography>
        <Typography variant="body1" color="text.secondary">
          시행일: 2025.10.01
        </Typography>
      </Box>

      {/* 약관 내용 */}
      <Box
        sx={{
          '& h2': {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 4,
            mb: 2,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            pb: 1,
          },
          '& h3': {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 3,
            mb: 1.5,
          },
          '& p': {
            fontSize: '1rem',
            lineHeight: 1.8,
            color: theme.palette.text.primary,
            mb: 2,
            textAlign: 'justify',
          },
          '& ol, & ul': {
            pl: 3,
            mb: 2,
          },
          '& li': {
            fontSize: '1rem',
            lineHeight: 1.8,
            color: theme.palette.text.primary,
            mb: 1,
          },
          '& strong': {
            fontWeight: 600,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Typography variant="h2" component="h2">
          제1조(목적)
        </Typography>
        <Typography component="p">
          누비아(이하 '회사'라고 함)는 회사가 제공하고자 하는 서비스(이하 '회사 서비스')를 이용하는 개인(이하 '이용자' 또는 '개인')의 정보(이하
          '개인정보')를 보호하기 위해, 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법') 등 관련 법령을 준수하고,
          서비스 이용자의 개인정보 보호 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침(이하 '본 방침')을
          수립합니다.
        </Typography>

        <Typography variant="h2" component="h2">
          제2조(개인정보 처리의 원칙)
        </Typography>
        <Typography component="p">
          개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를 수집할 수 있으며 수집된 개인정보는 개인의 동의가 있는 경우에 한해 제3자에게
          제공될 수 있습니다. 단, 법령의 규정 등에 의해 적법하게 강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의 없이 제3자에게
          제공할 수도 있습니다.
        </Typography>

        <Typography variant="h2" component="h2">
          제3조(본 방침의 공개)
        </Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">
            회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 회사 홈페이지 첫 화면 또는 첫 화면과의 연결화면을 통해 본 방침을 공개하고
            있습니다.
          </Typography>
          <Typography component="li">
            회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기, 색상 등을 활용하여 이용자가 본 방침을 쉽게 확인할 수 있도록 합니다.
          </Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제4조(본 방침의 변경)
        </Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">
            본 방침은 개인정보 관련 법령, 지침, 고시 또는 정부나 회사 서비스의 정책이나 내용의 변경에 따라 개정될 수 있습니다.
          </Typography>
          <Typography component="li">
            회사는 제1항에 따라 본 방침을 개정하는 경우 다음 각 호 하나 이상의 방법으로 공지합니다.
            <Box component="ol" sx={{ pl: 3, mt: 1 }}>
              <Typography component="li">회사가 운영하는 인터넷 홈페이지의 첫 화면의 공지사항란 또는 별도의 창을 통하여 공지하는 방법</Typography>
              <Typography component="li">서면·모사전송·전자우편 또는 이와 비슷한 방법으로 이용자에게 공지하는 방법</Typography>
            </Box>
          </Typography>
          <Typography component="li">
            회사는 제2항의 공지는 본 방침 개정의 시행일로부터 최소 7일 이전에 공지합니다. 다만, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일
            전에 공지합니다.
          </Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제5조(회원 가입을 위한 정보)
        </Typography>
        <Typography component="p">회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.</Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">필수 수집 정보: 이메일 주소, 이름 및 닉네임</Typography>
          <Typography component="li">선택 수집 정보: 프로필 사진</Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제6조(본인 인증을 위한 정보)
        </Typography>
        <Typography component="p">회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.</Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">필수 수집 정보: 이메일 주소 및 이름</Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제7조(서비스 이용 및 부정 이용 확인을 위한 정보)
        </Typography>
        <Typography component="p">
          회사는 이용자의 서비스 이용에 따른 통계∙분석 및 부정이용의 확인∙분석을 위하여 다음과 같은 정보를 수집합니다. (부정이용이란 회원탈퇴 후
          재가입, 상품구매 후 구매취소 등을 반복적으로 행하는 등 회사가 제공하는 할인쿠폰, 이벤트 혜택 등의 경제상 이익을 불·편법적으로 수취하는 행위,
          이용약관 등에서 금지하고 있는 행위, 명의도용 등의 불·편법행위 등을 말합니다.)
        </Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">필수 수집 정보: 서비스 이용기록, 쿠키, 접속지 정보 및 기기정보</Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제8조(개인정보 수집 방법)
        </Typography>
        <Typography component="p">회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.</Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">이용자가 회사의 홈페이지에 자신의 개인정보를 입력하는 방식</Typography>
          <Typography component="li">어플리케이션 등 회사가 제공하는 홈페이지 외의 서비스를 통해 이용자가 자신의 개인정보를 입력하는 방식</Typography>
          <Typography component="li">이용자가 회사가 발송한 이메일을 수신받아 개인정보를 입력하는 방식</Typography>
        </Box>

        <Typography variant="h2" component="h2">
          제9조(개인정보의 이용)
        </Typography>
        <Typography component="p">회사는 개인정보를 다음 각 호의 경우에 이용합니다.</Typography>
        <Box component="ol" sx={{ pl: 3 }}>
          <Typography component="li">공지사항의 전달 등 회사운영에 필요한 경우</Typography>
          <Typography component="li">이용문의에 대한 회신, 불만의 처리 등 이용자에 대한 서비스 개선을 위한 경우</Typography>
          <Typography component="li">회사의 서비스를 제공하기 위한 경우</Typography>
          <Typography component="li">
            법령 및 회사 약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및
            제재를 위한 경우
          </Typography>
          <Typography component="li">신규 서비스 개발을 위한 경우</Typography>
          <Typography component="li">이벤트 및 행사 안내 등 마케팅을 위한 경우</Typography>
          <Typography component="li">인구통계학적 분석, 서비스 방문 및 이용기록의 분석을 위한 경우</Typography>
        </Box>

        {/* 개인정보 보호 책임자 정보 */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: theme.palette.primary.light + '20',
            borderRadius: 2,
            border: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Typography variant="h2" component="h2">
            제23조(회사의 개인정보 보호 책임자 지정)
          </Typography>
          <Typography component="p">
            회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호 책임자를 지정하고
            있습니다.
          </Typography>
          <Box component="ol" sx={{ pl: 3 }}>
            <Typography component="li">
              개인정보 보호 책임자
              <Box component="ol" sx={{ pl: 3, mt: 1 }}>
                <Typography component="li">성명: 김경남</Typography>
                <Typography component="li">직책: 대표</Typography>
                <Typography component="li">전화번호: 01050171437</Typography>
                <Typography component="li">이메일: biz.kimson1125@gmail.com</Typography>
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* 시행일 */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            bgcolor: theme.palette.success.light + '20',
            borderRadius: 2,
            border: `1px solid ${theme.palette.success.light}`,
          }}
        >
          <Typography variant="h3" component="h3">
            부칙
          </Typography>
          <Typography variant="h3" component="h3">
            제1조(시행일)
          </Typography>
          <Typography component="p">본 방침은 2025.10.01.부터 시행됩니다.</Typography>
        </Box>
      </Box>
    </Fragment>
  );
};

export default PrivacyContent;
