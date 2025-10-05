# HR Management (Lit + Vite)

A lightweight HR management demo built with modern Web Components using Lit, bundled with Vite. It showcases employee listing, CRUD-like interactions, form validation, client-side routing, state management, localization, and a fully tested component architecture.

## Features
- Employee directory with pagination, and simple actions
- Forms with validation and helpful messages
- Client-side routing and layout structure
- Centralized state management
- Localization (i18n) with English and Turkish strings
- Reusable UI components (button, input, dropdown, modal, table, toast, etc.)
- Unit tests with code coverage

## Tech Stack
- Framework: [Lit](https://lit.dev/) for fast, standards-based Web Components
- Bundler/Dev Server: [Vite](https://vitejs.dev/)
- Routing: [@vaadin/router](https://github.com/vaadin/router)
- State Management: [Zustand](https://github.com/pmndrs/zustand)
- Validation: [Yup](https://github.com/jquense/yup)
- Styles: SCSS modules compiled by Vite
- Testing: [Vitest](https://vitest.dev/), [@testing-library/dom](https://testing-library.com/docs/dom-testing-library/intro/), and [jsdom](https://github.com/jsdom/jsdom)
- Linting/Formatting: ESLint + Prettier

## Getting Started

### Prerequisites
- Node.js 22+ and npm/yarn/pnpm

### Installation
```bash
# install deps
npm install
# or
yarn
# or
pnpm install
```

### Development
```bash
npm run dev
# Vite dev server will start and print the local URL
```

### Build
```bash
npm run build
```

### Preview (after build)
```bash
npm run preview
```

### Test
```bash
# run tests once
npm run test

# watch mode
npm run test:watch

# interactive UI
npm run test:ui

# coverage
npm run coverage
```

## Project Structure (high level)
```
src/
  app-root.js           # App shell and router outlet
  components/           # Reusable UI components (Lit web components)
  layout/               # Layout elements (header, main)
  pages/                # Route pages (employees, form)
  store/                # Zustand store
  locales/              # i18n strings (en, tr)
  utils/                # Helpers (date, validation, localization)
  styles/               # SCSS styles by domain
```

## Localization
Two locales are available: English (`en`) and Turkish (`tr`). Switchers and mixins are provided to load strings dynamically at runtime.

## License
This project is provided as a demo. Use freely for learning and experimentation.
