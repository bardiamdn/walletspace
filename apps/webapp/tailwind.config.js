const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)', 
        'background-secondary': 'var(--color-background-secondary)', 
        'background-warning': 'var(--color-background-warning)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-reverse': 'var(--color-text-reverse)',
        border: 'var(--color-border)',
        'button-primary': 'var(--color-button-primary)',
        'button-secondary': 'var(--color-button-secondary)',
        'button-hover': 'var(--color-button-hover)',
        'button-selected': 'var(--color-button-selected)',
        'button-disabled': 'var(--color-button-disabled)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
};
