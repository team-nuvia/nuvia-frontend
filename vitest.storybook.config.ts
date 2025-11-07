import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, defineProject } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Storybook 테스트 설정 (.stories.tsx 파일용)
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      defineProject({
        plugins: [
          storybookTest({
            // The location of your Storybook config, main.js|ts
            configDir: path.join(dirname, '.storybook'),
            // This should match your package.json script to run Storybook
            // The --no-open flag will skip the automatic opening of a browser
            storybookScript: 'yarn storybook --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          // Enable browser mode
          browser: {
            enabled: true,
            // Make sure to install Playwright
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      }),
    ],
  },
});

