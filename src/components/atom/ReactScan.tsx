'use client';

import { useEffect } from 'react';
import { scan } from 'react-scan';

interface ReactScanProps {}
const ReactScan: React.FC<ReactScanProps> = () => {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
};

export default ReactScan;
