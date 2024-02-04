const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = Boolean(env?.analyze);

  const config = {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './'),
      },
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'],
    },
    entry: ['@babel/polyfill', './index.js'],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [['@babel/plugin-transform-runtime', { regenerator: true }]],
            },
          },
        },
        // {
        //   test: /\.(js|jsx)$/,
        //   use: {
        //     loader: 'imports-loader',
        //     options: {
        //       imports: ['default react React'],
        //     },
        //   },
        // },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: !isProduction },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: !isProduction },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                postcssOptions: {
                  plugins: [tailwindcss, autoprefixer],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: isProduction
                  ? 'static/media/[name].[contenthash:6].[ext]'
                  : '[path][name].[ext]',
              },
            },
          ],
        },
        // {
        //   test: /\.(woff|woff2|eot|ttf|otf)$/,
        //   use: [
        //     {
        //       loader: "file-loader",
        //       options: {
        //         name: isProduction
        //           ? "static/fonts/[name].[ext]"
        //           : "[path][name].[ext]",
        //       },
        //     },
        //   ],
        // },
      ],
    },

    output: {
      filename: 'static/js/main.[contenthash:6].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    devServer: {
      hot: true,
      port: 3000,
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, 'public', 'index.html'),
        serveIndex: true,
        watch: true,
      },
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? 'static/css/[name].[contenthash:6].css' : '[name].css',
      }),
      new Dotenv(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: '.',
            filter: (name) => {
              return !name.endsWith('index.html');
            },
          },
        ],
      }),

      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        filename: 'index.html',
      }),
      new ESLintPlugin({
        extensions: ['.js', '.jsx'],
      }),
      new webpack.ProvidePlugin({
        "React": "react",
     }),
    ],
  };

  if (isProduction) {
    config.plugins = [
      ...config.plugins,
      new webpack.ProgressPlugin(),
      new CompressionPlugin({
        test: /\.(css|js)$/,
        algorithm: 'brotliCompress',
      }),
      new CleanWebpackPlugin(),
    ];
    if (isAnalyze) {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()];
    }
    config.optimization = {
      minimizer: [`...`, new CssMinimizerPlugin()],
    };
  }

  return {
    ...config,
  };
};
