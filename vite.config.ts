/* eslint-disable node/prefer-global/process */

import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  define: {
    __COMMIT_SHA__: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ?? 'dev'),
  },
});
