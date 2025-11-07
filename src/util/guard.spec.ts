import { describe, expect, it } from 'vitest';
import { isGuestPath, isMemberPath, isPublicPath } from './guard';

describe('guard passes', () => {
  it('should pass public path', () => {
    expect(isPublicPath('/')).toBe(true);
    expect(isGuestPath('/')).toBe(false);
    expect(isMemberPath('/')).toBe(false);
  });
});
