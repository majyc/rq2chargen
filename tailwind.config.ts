import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a56db',
          foreground: '#ffffff'
        }
      }
    }
  },
  plugins: [typography, forms]
} satisfies Config;
