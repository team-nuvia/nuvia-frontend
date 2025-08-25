import CommonText from '@components/atom/CommonText';
import Showbox from '@components/atom/Showbox';
import { BaseSection } from '@components/organism/BaseSection';
import { ArrowForward } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useTheme } from '@mui/material';

export const FAQSection = () => {
  const theme = useTheme();
  const faqs = [
    {
      question: '응답률 대신 완료율을 쓰는 이유는?',
      answer: '불특정 다수 설문 특성상 모수 파악이 어려워, 시작 대비 완료율로 품질을 봅니다.',
    },
    {
      question: '비회원도 참여 가능?',
      answer: '가능합니다. 링크만 있으면 작성할 수 있어요.',
    },
    {
      question: '응답 완료 후 수정 가능한가요?',
      answer: '가능합니다. 응답 만료시간 전까지 언제든지 수정 가능합니다.',
    },
    {
      question: '데이터는 얼마나 보관되나요?',
      answer: '기본 1년, 필요시 언제든지 연장 가능합니다.',
    },
    {
      question: '설문 결과를 수정할 수 있나요?',
      answer: '설문 발행 후 응답자가 있을 시에는 수정이 제한됩니다. 발행 전에 충분히 검토해주세요.',
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], py: { xs: 12, md: 16 }, position: 'relative' }}>
      <BaseSection>
        <Stack spacing={3} alignItems="center" textAlign="center" mb={6}>
          <Showbox>
            <CommonText variant="h3" thickness="bold" gutterBottom>
              자주 묻는 질문
            </CommonText>
          </Showbox>
          <Showbox>
            <CommonText variant="body1" color="text.secondary">
              마찰을 제거하고 빠르게 시작하세요
            </CommonText>
          </Showbox>
        </Stack>

        <Stack gap={2} sx={{ maxWidth: 800, mx: 'auto' }}>
          {faqs.map((faq, idx) => (
            <Showbox key={idx}>
              <Accordion sx={{ borderRadius: 2, boxShadow: 2 }}>
                <AccordionSummary expandIcon={<ArrowForward />}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Showbox>
          ))}
        </Stack>
      </BaseSection>
    </Box>
  );
};
