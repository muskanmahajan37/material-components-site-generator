const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { BuildDir, PROD_SITE_ROOT } = require('./scripts/lib/project-paths');


const buildEnv = process.env.BUILD_ENV || 'development';
const buildPath = path.resolve(`${__dirname}/${BuildDir.STAGE}`);
const modulesPath = path.resolve(`${__dirname}/node_modules`);

const IS_PROD = buildEnv == 'production';
const IS_DEV = !IS_PROD;

const CSS_LOADERS = [
  {
    loader: 'css-loader',
    options: {
      minimize: true,
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () =>[require('autoprefixer')({grid: false})],
    },
  },
  {
    loader: 'sass-loader',
    options: {
      data: IS_PROD ? `$rootpath: '${ PROD_SITE_ROOT }';` : '',
      includePaths: ['node_modules'],
      sourceMap: true,
    },
  },
];

module.exports = [{
  name: 'js',
  entry: `${buildPath}/_js_src/index.js`,
  output: {
    path: `${buildPath}/js`,
    publicPath: '/js',
    filename: 'index.js',
  },
  devtool: IS_DEV ? 'source-map' : false,
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: IS_DEV
    }),
  ],
}, {
  name: 'css',
  entry: {
    app: `${buildPath}/_css_src/app.scss`,
    codemirror: `${modulesPath}/codemirror/lib/codemirror.css`,
  },
  output: {
    path: `${buildPath}/css`,
    publicPath: '/css',
    filename: '[name].css',
  },
  module: {
    rules: [{
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        use: CSS_LOADERS,
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
}];
