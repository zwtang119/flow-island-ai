
import path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/flow-island-demo/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {
        // Fix: Align with coding guidelines to use API_KEY from environment variables.
        'process.env.API_KEY': JSON.stringify(env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
