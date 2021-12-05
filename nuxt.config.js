import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - Social Network',
    title: 'Sfun',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Encode+Sans+Semi+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap',
      },
    ],
  },

  css: ['@/assets/scss/all.scss'],

  plugins: [{ src: '~plugins/element-ui.js', ssr: true }],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/dotenv', '@nuxtjs/auth-next', 'nuxt-socket-io'],

  io: {
    sockets: [
      {
        name: 'home',
        url: 'https://sfun-net.herokuapp.com',
        default: true,
      },
    ],
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
        },
        refreshToken: {
          property: 'refreshtoken',
          data: 'refreshtoken',
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: `${process.env.API_URL}/api/auth/login`,
            method: 'post',
          },
          refresh: {
            url: `${process.env.API_URL}/api/auth/refresh`,
            method: 'post',
          },
          logout: true,
          user: { url: `${process.env.API_URL}/api/auth/user`, method: 'get' },
        },
      },
    },
  },

  axios: { baseURL: process.env.API_URL },

  pwa: {
    manifest: {
      lang: 'en',
    },
    icon: {
      source: '~/static',
      fileName: 'favicon.ico',
    },
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#03A9F4',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  build: {},

  target: 'static',
}
