'use client';

import ErrorTemplate from '@components/template/error/ErrorTemplate';

interface ErrorProps {
  error: Error;
}
export default function Error(_props: ErrorProps) {
  return <ErrorTemplate type="error" />;
}
