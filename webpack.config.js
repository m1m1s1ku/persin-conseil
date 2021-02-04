'use strict';

const { resolve, join } = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const {GenerateSW} = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");

const ENV = process.argv.find(arg => arg.includes('production'))
  ? 'production'
  : 'development';
const OUTPUT_PATH = ENV === 'production' ? resolve('dist') : resolve('src');
const INDEX_TEMPLATE = resolve('./src/index.html');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const assets = [
  {
    from: resolve('./src/assets'),
    to: resolve('dist/assets/')
  }
];

const polyfills = [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.js`),
    to: join(OUTPUT_PATH, 'vendor', '[name].[ext]')
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.js`),
    to: join(OUTPUT_PATH, 'vendor', 'bundles', '[name].[ext]')
  },
  {
    from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: join(OUTPUT_PATH, 'vendor', '[name].[ext]')
  }
];

const commonConfig = merge([
  {
    entry: './src/persin-app.ts',
    output: {
      path: OUTPUT_PATH,
      filename: '[name].[chunkhash:8].js'
    },
    resolve: {
      extensions: [ '.ts', '.js' ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new WebpackManifestPlugin(),
      new WebpackPwaManifest({
        filename: 'app-manifest.json',
        theme_color: '#42BB74',
        name: 'Persin Conseil : Prestation de Services Informatique',
        short_name: 'Persin',
        description: 'Installation Formation Assistance Informatique Paris',
        background_color: '#ffffff',
        crossorigin: 'use-credentials',
        icons: [
          {
            src: resolve('./src/assets/icons/icon-1024-1024.png'),
            sizes: "1024x1024",
            type: "image/png"
          },
          {
            src: resolve('./src/assets/icons/icon-512-512.png'),
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: resolve('./src/assets/icons/icon-256-256.png'),
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: resolve('./src/assets/icons/icon-192-192.png'),
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: resolve('./src/assets/icons/icon-128-128.png'),
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: resolve('./src/assets/icons/icon-96-96.png'),
            sizes: "96x96",
            type: "image/png"
          }
        ]
      })
    ]
  }
]);

const developmentConfig = merge([
  {
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin({patterns: polyfills}),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE
      })
    ],

    devServer: {
      contentBase: OUTPUT_PATH,
      compress: true,
      overlay: true,
      port: 3000,
      historyApiFallback: true,
      host: 'localhost'
    }
  }
]);

const productionConfig = merge([
  {
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({patterns: [...polyfills, ...assets]}),
      new HtmlWebpackPlugin({
        template: INDEX_TEMPLATE,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true
        }
      }),
      new GenerateSW({
        swDest: 'service-worker.js',
        exclude: ['**/*.map', '**/*.gz', '**/*.d.ts'],
      }),
      new ImageminWebpWebpackPlugin({
        config: [{
          test: /\.(jpe?g|png)$/,
          options: {
            quality:  50
          }
        }],
        detailedLogs: true
      })
    ]
  }
]);

module.exports = mode => {
  if (mode.production) {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
};
