import { env } from 'node:process';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const commitSha = env.COMMIT_SHA ?? env.CF_PAGES_COMMIT_SHA ?? 'dev';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  define: {
    __COMMIT_SHA__: JSON.stringify(commitSha),
  },
});
