import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/helpers/colors.scss" as *;
          @use "@/styles/helpers/normalize.scss" as *;
          @use "@/styles/helpers/variables.scss" as *;
        `,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/tests/setup/vitest-setup.js'],
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      'node_modules',
      'dist',
      'src/data/**',
      '**/*.config.{js,ts,cjs,mjs}',
      'vite.config.{js,ts}',
      'eslint.config.{js,cjs,mjs}',
    ],
    css: true,
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'src/data/**',
        '**/*.config.{js,ts,cjs,mjs}',
        'vite.config.{js,ts}',
        'eslint.config.{js,cjs,mjs}',
      ],
    },
  },
})
