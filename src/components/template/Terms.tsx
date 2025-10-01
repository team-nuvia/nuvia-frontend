'use client';

import { Box, Container, Typography, useTheme } from '@mui/material';

interface TermsProps {}

const Terms: React.FC<TermsProps> = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: 3,
            p: 6,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
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
              서비스 이용약관
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
              이 약관은 누비아 (이하 '회사' 라고 합니다)가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한
              사항을 규정함을 목적으로 합니다.
            </Typography>

            <Typography variant="h2" component="h2">
              제2조(정의)
            </Typography>
            <Typography component="p">이 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.</Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Typography component="li">
                '서비스'라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 '이용자'가 이용할 수 있는 회사가
                제공하는 제반 서비스를 의미합니다.
              </Typography>
              <Typography component="li">
                '이용자'란 이 약관에 따라 회사가 제공하는 서비스를 받는 '개인회원' , '기업회원' 및 '비회원'을 말합니다.
              </Typography>
              <Typography component="li">
                '개인회원'은 회사에 개인정보를 제공하여 회원등록을 한 사람으로, 회사로부터 지속적으로 정보를 제공받고 '회사'가 제공하는 서비스를
                계속적으로 이용할 수 있는 자를 말합니다.
              </Typography>
              <Typography component="li">
                '기업회원'은 회사에 기업정보 및 개인정보를 제공하여 회원등록을 한 사람으로, 회사로부터 지속적으로 정보를 제공받고 회사가 제공하는
                서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </Typography>
              <Typography component="li">'비회원'은 회원가입 없이 회사가 제공하는 서비스를 이용하는 자를 말합니다.</Typography>
              <Typography component="li">
                '아이디(ID)'라 함은 회원의 식별과 서비스이용을 위하여 회원이 정하고 회사가 승인하는 문자 또는 문자와 숫자의 조합을 의미합니다.
              </Typography>
              <Typography component="li">
                '비밀번호'라 함은 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀의 보호를 위해 회원 자신이 정한 문자(특수문자 포함)와 숫자의
                조합을 의미합니다.
              </Typography>
              <Typography component="li">'유료서비스'라 함은 회사가 유료로 제공하는 제반 서비스를 의미합니다.</Typography>
              <Typography component="li">
                '결제'란 회사가 제공하는 유료서비스를 이용하기 위하여 회원이 지불수단을 선택하고, 금융정보를 입력하는 행위를 말합니다.
              </Typography>
              <Typography component="li">
                '할인쿠폰'은 이용자가 회사의 서비스를 이용하면서 그 대가를 지급하는데 사용하기 위하여 회사가 발행 및 관리하는 지급수단을 말합니다.
              </Typography>
              <Typography component="li">
                '콘텐츠'란 정보통신망법의 규정에 따라 정보통신망에서 사용되는 부호 ·문자·음성·음향·이미지 또는 영상 등으로 정보 형태의 글, 사진,
                동영상 및 각종 파일과 링크 등을 말합니다.
              </Typography>
            </Box>

            <Typography variant="h2" component="h2">
              제3조(약관 외 준칙)
            </Typography>
            <Typography component="p">
              이 약관에서 정하지 아니한 사항에 대해서는 법령 또는 회사가 정한 서비스의 개별약관, 운영정책 및 규칙 등(이하 세부지침)의 규정에 따릅니다.
              또한 본 약관과 세부지침이 충돌할 경우에는 세부지침에 따릅니다.
            </Typography>

            <Typography variant="h2" component="h2">
              제4조(약관의 효력과 변경)
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Typography component="li">
                이 약관은 누비아(이)가 제공하는 모든 인터넷서비스에 게시하여 공시합니다. '회사'는 '전자상거래 등에서의 소비자보호에 관한 법률(이하
                '전자상거래법'이라 함)', '약관의 규제에 관한 법률(이하 '약관규제법'이라 함)', '전자문서 및 전자거래 기본법(이하 '전자문서법'이라 함)',
                '전자금융거래법 ', '정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법'이라 함)', '소비자기본법' 등 관계 법령(이하
                '관계법령' 이라 함)에 위배되지 않는 범위 내에서 이 약관을 변경할 수 있으며, 회사는 약관이 변경되는 경우에 변경된 약관의 내용과
                시행일을 정하여, 그 시행일로부터 최소 7일 (이용자에게 불리하거나 중대한 사항의 변경은 30일) 이전부터 시행일 후 상당한 기간 동안
                공지하고, 기존 이용자에게는 변경된 약관, 적용일자 및 변경사유(변경될 내용 중 중요사항에 대한 설명을 포함)를 별도의 전자적
                수단(전자우편, 문자메시지, 서비스 내 전자쪽지발송, 알림 메시지를 띄우는 등의 방법)으로 개별 통지합니다. 변경된 약관은 공지하거나
                통지한 시행일로부터 효력이 발생합니다.
              </Typography>
              <Typography component="li">
                회사가 제1항에 따라 개정약관을 공지 또는 통지하는 경우 '변경에 동의하지 아니한 경우 공지일 또는 통지를 받은 날로부터 7일(이용자에게
                불리하거나 중대한 사항의 변경인 경우에는 30일) 내에 계약을 해지할 수 있으며, 계약해지의 의사표시를 하지 아니한 경우에는 변경에 동의한
                것으로 본다.' 라는 취지의 내용을 함께 통지합니다.
              </Typography>
              <Typography component="li">
                이용자가 제2항의 공지일 또는 통지를 받은 날로부터 7일(또는 이용자에게 불리하거나 중대한 사항의 변경인 경우에는 30일)내에 변경된 약관에
                대해 거절의 의사를 표시하지 않았을 때에는 본 약관의 변경에 동의한 것으로 간주합니다.
              </Typography>
            </Box>

            {/* 나머지 조항들도 동일한 패턴으로 계속... */}
            <Typography variant="h2" component="h2">
              제5조(이용자에 대한 통지)
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Typography component="li">
                회사는 이 약관에 별도 규정이 없는 한 이용자에게 전자우편, 문자메시지(SMS), 전자쪽지, 푸쉬(Push)알림 등의 전자적 수단을 이용하여 통지할
                수 있습니다.
              </Typography>
              <Typography component="li">
                회사는 이용자 전체에 대한 통지의 경우 7일 이상 회사가 운영하는 웹사이트 내의 게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다.
                다만, 이용자 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 제1항의 개별 통지를 합니다.
              </Typography>
              <Typography component="li">
                회사는 이용자의 연락처 미기재, 변경 후 미수정, 오기재 등으로 인하여 개별 통지가 어려운 경우에 한하여 전항의 공지를 함으로써 개별
                통지를 한 것으로 간주합니다.
              </Typography>
            </Box>

            {/* 시행일 */}
            <Box
              sx={{
                mt: 6,
                p: 3,
                bgcolor: theme.palette.primary.light + '20',
                borderRadius: 2,
                border: `1px solid ${theme.palette.primary.light}`,
              }}
            >
              <Typography variant="h3" component="h3">
                부칙
              </Typography>
              <Typography variant="h3" component="h3">
                제1조(시행일)
              </Typography>
              <Typography component="p">본 약관은 2025.10.01.부터 시행됩니다.</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Terms;
