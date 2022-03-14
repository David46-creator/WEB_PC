'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '实习管理系统' // page title

// 如果端口设置为80,
// 请使用管理员权限执行命令行.
// 您可以通过以下方法更改端口:
// port = 9527 npm run dev 或 npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port


// let cdn = { css: [], js: [] }
// // 通过环境变量 来区分是否使用cdn
// const isProd = process.env.NODE_ENV === 'production' // 判断是否是生产环境
// let externals = {}
// if (isProd) {
//   // 如果是生产环境 就排除打包 否则不排除
//   externals = {
//     // key(包名) / value(这个值 是 需要在CDN中获取js, 相当于 获取的js中 的该包的全局的对象的名字)
//     'vue': 'VUE', // 后面的名字不能随便起 应该是 js中的全局对象名
//     'element-ui': 'ELEMENT', // 都是js中全局定义的
//     'xlsx': 'XLSX' // 都是js中全局定义的
//   }
//   cdn = {
//     css: [
//       'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // 提前引入elementUI样式
//     ], // 放置css文件目录
//     js: [
//       'https://cdn.jsdelivr.net/npm/vue@2', // vuejs
//       'https://unpkg.com/element-ui/lib/index.js', // element
//       'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js', // xlsx 相关
//       'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js' // xlsx 相关
//     ] // 放置js文件目录
//   }
// }

// 注意：修改了配置文件后一定要重启才会生效;


// 所有配置项说明可在中找到https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        //代理api
        target: 'http://47.107.59.34:8080/', // 代理接口(注意只要域名就够了)
        // changeOrigin: true, //是否跨域
        ws: true, // proxy websockets
        pathRewrite: {
          //重写路径
          '^/api': '' //代理路径
        }
      }
    }
    // 当调用所有请求之前，调用这个mock-server 里面的接口提供的假数据
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在Webpack的名称字段中提供应用程序的标题，以便可以在索引中访问。html来插入正确的标题
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 排除 elementUI xlsx  和 vue
    // externals:
    //   {
    //     'vue': 'Vue',
    //     'element-ui': 'ELEMENT',
    //     'xlsx': 'XLSX'
    //   }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // config.plugin('html').tap(args => {
    //   args[0].cdn = cdn
    //   return args
    // })
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
