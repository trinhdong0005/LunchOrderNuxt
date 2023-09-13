// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'Đặt cơm trưa',
      meta: [
        { name: 'description', content: 'Đặt cơm trưa' }
      ],
      htmlAttrs: {
        lang: 'vi'
      }
    }
  },
  ssr: false,
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss'
  ],
  image: { dir: 'assets/img' },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000/'
    }
  }
})
