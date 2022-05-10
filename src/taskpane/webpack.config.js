const devCerts = require('office-addin-dev-certs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = async (env, options) => {
  const devServe = options.host === 'localhost';

  const config = {
    devtool: 'source-map',
    entry: {
      taskpane: [
        'react-hot-loader/patch',
        './src/taskpane/index.js',
      ],
      // commands: './src/commands/commands.js'
    },
    resolve: {
      extensions: ['.html', '.js'],
    },

    output: {
      path: path.resolve(`${__dirname}/../../build/word/`),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            'react-hot-loader/webpack',
            'babel-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
          use: {
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[ext]',
            },
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'taskpane.html',
        template: './src/taskpane/taskpane.html',
        chunks: ['taskpane', 'vendor'],
      }),
      devServe ? new CopyWebpackPlugin([
        { from: './public/fabric-icons', to: 'fabric-icons' },
      ]) : null,
      new CopyWebpackPlugin([
        { from: 'node_modules/@microsoft/office-js/dist/', to: 'office' },
      ]),
      new CopyWebpackPlugin([
        { from: './public/icon-*x.png', flatten: true },
      ]),
      new webpack.ProvidePlugin({
        Promise: ['es6-promise', 'Promise'],
      }),
      new CopyWebpackPlugin([
        {
          from: './src/taskpane/manifest.xml',
          to: 'manifest.xml',
          transform(content) {
            return content.toString()
              .replace(/localhost:3101\//g, 'WEB_HOST/word/')
              .replace(/localhost:3101/g, 'WEB_HOST');
          },
        },
      ]),
    ].filter((x) => x),
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      https: devServe ? await devCerts.getHttpsServerOptions() : null,
      port: 3101,
      contentBase: false,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            test: path.resolve(__dirname, '..', '..', 'node_modules'),
            name: 'vendor',
            enforce: true,
          },
        },
      },
    },
  };

  return config;
};
