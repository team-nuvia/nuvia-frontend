import { defineConfig } from 'vitest/config';

// 일반 단위 테스트 설정 (.spec.ts 파일용)
export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
  },
});
