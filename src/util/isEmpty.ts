import { isNil } from './isNil';

export const isEmpty = <T>(
  value: T | null | undefined,
): value is null | undefined => {
  return isNil(value) || value === '' || value === false || value === 0;
};
