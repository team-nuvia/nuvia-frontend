import { Stack, StackProps, SxProps, Theme } from '@mui/material';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface ShowboxProps {
  children: React.ReactNode;
  delay?: number;
  sx?: SxProps<Theme>;
}

const Showbox = ({
  children,
  delay = 200,
  sx,
  ...props
}: ShowboxProps & StackProps) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [delayTime, setDelayTime] = useState(800);
  // const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   // if (isInitialized) return;
  //   const timeout = setTimeout(() => {
  //     setDelayTime(150);
  //     // setIsInitialized(true);
  //   }, delay + 800);

  //   return () => {
  //     clearTimeout(timeout);
  //     setDelayTime(800);
  //     // setIsInitialized(false);
  //   };
  // }, []);

  return (
    <Stack
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(40px)',
        transition: `opacity ${delayTime}ms ${
          // isInitialized ? 0 :
          delay
        }ms ease-out, transform ${delayTime}ms ${
          // isInitialized ? 0 :
          delay
        }ms ease-out`,
        // animation: inView ? `${fadeIn} 1s ease-out both ${delay}ms` : 'none',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default Showbox;
