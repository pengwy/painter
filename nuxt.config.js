

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://at.alicdn.com/t/font_904289_5kjmo26bbvh.css'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  router:{
    // base: '/app/'
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
    },
    // routes: [
    //   { path: '*', component: (__dirname, 'pages/index.vue') }
    // ]
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['@nuxtjs/axios', {
      proxy: true
    }]
  ],
  proxy: {
    '/api/': {
      target: 'http://admin.cw100.la/',
      pathRewrite: {
        '^/api/': ''
      }
    },
    '/baseImg/':{
      target: 'http://admin.cw100.la/',
      pathRewrite: {
        '^/baseImg/': ''
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    publicPath: '/poster',
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
