import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import PostcssPresetEnv from 'postcss-preset-env';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import DotenvPlugin from 'dotenv-webpack';
import dotenv from 'dotenv';

dotenv.config();

const production = process.env['ENV'] === 'production';
const projectRoot = path.resolve(__dirname, '..');

const config: webpack.Configuration = {
  entry: {
    vendor: ['react', 'react-dom', 'react-router-dom'],
    app: {
      import: path.join(projectRoot, 'src/index.tsx'),
      dependOn: 'vendor',
    },
  },
  target: 'web',
  devtool: production ? undefined : 'inline-source-map',
  mode: production ? 'production' : 'development',
  output: {
    path: path.join(projectRoot, 'dist/'),
    filename: '[name].bundle.js',
    publicPath: '',
  },
  devServer: {
    contentBase: path.join(projectRoot, 'src/'),
    watchContentBase: true,
    hot: true,
    inline: true,
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(projectRoot, 'tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/i,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf|png|jpg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          production ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [PostcssPresetEnv],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: production ? true : false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(projectRoot, 'src/index.html'),
    }),
    new DotenvPlugin({
      path:
        production === true
          ? path.resolve(`${__dirname}/../.env-app.production`)
          : path.resolve(`${__dirname}/../.env-app.development`),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
};

export default config;
