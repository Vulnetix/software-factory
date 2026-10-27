// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Keep in sync with public/CNAME and terraform/dns.tf.
  site: 'https://software-factory.vulnetix.com',
  base: '/',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
