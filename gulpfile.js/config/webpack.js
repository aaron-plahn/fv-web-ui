var path            = require('path')
var webpack         = require('webpack')
var StatsPlugin     = require('stats-webpack-plugin');
var webpackManifest = require('../lib/webpackManifest')

var config          = require('./')

module.exports = function(env) {

  var port = 3001;

  var jsSourceDirectory = config.sourceAssets + config.javascriptDirectory + '/';
  var stylesSourceDirectory = config.sourceAssets + config.stylesheetsDirectory + '/';

  var jsPublicDirectory = config.publicAssets + config.javascriptDirectory + '/';

  var absPublicDirectory = path.resolve(config.publicDirectory)
  var absJSSourceDirectory = path.resolve(jsSourceDirectory)
  var absJSPublicDirectory = path.resolve(jsPublicDirectory)

  var webpackConfig = {

    context: absJSSourceDirectory,

    node: {
      fs: "empty",
      net: "empty",
      tls: "empty",
      console: true
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
      alias: {
        styles : path.resolve(stylesSourceDirectory),
        models: path.resolve(jsSourceDirectory + 'models/'),
        views: path.resolve(jsSourceDirectory + 'views/'),
        conf: path.resolve(jsSourceDirectory + 'configuration/'),
        operations: path.resolve(jsSourceDirectory + 'operations/'),
        common: path.resolve(jsSourceDirectory + 'common/'),
        stores: path.resolve(jsSourceDirectory + 'stores/'),
        actions: path.resolve(jsSourceDirectory + 'actions/')
      },
      extensions: ['', '.js', '.less']
    },

    module: {
      loaders: [
        { test: /\.js$/, loaders: ['react-hot', 'babel'], include: absJSSourceDirectory },
        //{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        { test: /\.less$/, loader: "style!css!less" },
        { test: /\.json$/, loader: "json" },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
      ],
      noParse: /node_modules\/json-schema\/lib\/validate\.js/
    }
  }


  if(env !== 'test') {
    // Karma doesn't need entry points or output settings

    webpackConfig.entry= {
      app: [
        'webpack-dev-server/client?http://0.0.0.0:' + port, // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './app.js'
      ]
    }

    webpackConfig.output= {
      filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      path: absJSPublicDirectory,
      publicPath: config.assetsDirectory + config.javascriptDirectory + '/',
      contentBase: absPublicDirectory
    }

    // Factor out common dependencies into a shared.js
    webpackConfig.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'shared',
        filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      })
    )
  }

  if(env === 'development') {
    webpackConfig.devtool = '#source-map'
    webpack.debug = true

    webpackConfig.devServer = {
      inline:true,
      port: port
    };
  }

  if(env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest('/', 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      /*new StatsPlugin('stats.json', {
        chunkModules: true,
        exclude: [/node_modules[\\\/]react/]
      }),*/
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
