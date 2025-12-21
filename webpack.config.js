const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      main: './js/main.js',
      swipe: './js/swipe.js'
    },
    output: {
      filename: 'js/[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunks: ['main', 'swipe']
      }),
      new HtmlWebpackPlugin({
        template: './contact.html',
        filename: 'contact.html',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        template: './privacy.html',
        filename: 'privacy.html',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        template: './terms.html',
        filename: 'terms.html',
        chunks: ['main']
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { 
            from: 'images', 
            to: 'images',
            noErrorOnMissing: true 
          }
        ]
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      open: true,
      hot: true,
      watchFiles: ['*.html', 'css/**/*', 'js/**/*']
    },
    devtool: isDevelopment ? 'source-map' : false,
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          },
          bootstrap: {
            test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
            name: 'bootstrap',
            priority: 20
          }
        }
      }
    }
  };
};
