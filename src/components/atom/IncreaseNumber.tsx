import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import CommonText from './CommonText';

interface IncreaseNumberProps {
  content: number;
}
const IncreaseNumber: React.FC<IncreaseNumberProps> = ({ content }) => {
  gsap.registerPlugin(useGSAP);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // gsap code here...
      const tl = gsap.timeline();
      tl.to(container.current, {
        duration: 3,
        ease: 'power3.out',
        innerText: content,
        snap: { innerText: 1 },
      });
    },
    { scope: container },
  );

  return (
    <CommonText
      ref={container}
      variant="h6"
      color="textPrimary"
      thickness="bold"
    >
      {0}
    </CommonText>
  );
};

export default IncreaseNumber;
