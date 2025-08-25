'use client';

import LoadingContext from '@context/LodingContext';
import { Container, ContainerProps, Stack } from '@mui/material';
import { useContext, useLayoutEffect } from 'react';
import { AnalyticsPreviewSection } from './home-section/AnalyticsPreviewSection';
import { FAQSection } from './home-section/FAQSection';
import FeaturesSection from './home-section/FeaturesSection';
import { FinalCTASection } from './home-section/FinalCTASection';
import { HeroSection } from './home-section/HeroSection';
import { HowItWorksSection } from './home-section/HowItWorksSection';
import { KeyFeaturesSection } from './home-section/KeyFeaturesSection';
import { PricingTeaserSection } from './home-section/PricingTeaserSection';
import ProblemSection from './home-section/ProblemSection';
import SolutionSection from './home-section/SolutionSection';
import { TestimonialsSection } from './home-section/TestimonialsSection';
import { TrustSection } from './home-section/TrustSection';

interface HomeProps {}

const SectionContainer: React.FC<
  {
    children: React.ReactNode;
  } & ContainerProps
> = ({ children, ...props }) => (
  <Container component="section" {...props}>
    {children}
  </Container>
);

// ------------------ Page ------------------
const Home: React.FC<HomeProps> = () => {
  const { endLoading } = useContext(LoadingContext);
  useLayoutEffect(() => {
    endLoading();
  }, [endLoading]);

  return (
    <Stack flex={1} spacing={0} sx={{ backgroundColor: 'background.default' }}>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <KeyFeaturesSection />
      <AnalyticsPreviewSection />
      <HowItWorksSection />
      <PricingTeaserSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </Stack>
  );
};

export default Home;
