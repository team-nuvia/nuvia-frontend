'use client';

import ErrorTemplate from '@components/template/error/ErrorTemplate';

interface ErrorProps {
  error: Error;
}
export default function Error(props: ErrorProps) {
  console.log('🚀 ~ Error ~ props:', props);
  return <ErrorTemplate type="error" />;
}
