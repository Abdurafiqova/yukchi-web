export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      // Static hosting has no /api server, so sign-in is blocked on Vercel.
      demoMode: process.env.NUXT_PUBLIC_DEMO_MODE === 'true',
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/yuklar'],
      // Query links (/kirish?next=..., /yuklar?qidiruv=...) are the same pages
      // as their clean URLs; prerendering them writes '?'/'=' into file paths.
      ignore: [/[?#]/],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uz' },
      title: 'Yukchi.uz — Yuk tashish uchun ishonchli platforma',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Yukchi.uz — O'zbekiston bo'ylab yuk egalari va haydovchilarni bog'lovchi platforma. Yuk e'lonini joylang yoki mos reysni toping.",
        },
        { name: 'theme-color', content: '#1a365d' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
});
