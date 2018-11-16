const commonPaths = require('./common-paths');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  mode: 'production',
  entry: {
    app: [`${commonPaths.appEntry}/index.js`]
  },
  output: {
    filename: 'static/[name].[hash].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                camelCase: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
            }
          ]
        })
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          name: 'images/[hash].[ext]',
          limit: 10000,
        },
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['../public/static', '../public/styles', '../public/images', '../public/assets'], {allowExternal: true}),
    new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }]),
    new ExtractTextPlugin({
      filename: 'styles/styles.[hash].css',
      allChunks: true
    }),
  ]
};

module.exports = config;
