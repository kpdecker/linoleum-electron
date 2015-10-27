import webpack from 'webpack';

import {CLIENT_ENTRY, BUILD_TARGET} from '../index';
import BABEL_DEFAULTS from '../babel-defaults';

export default function(options = {}) {
  let isProduction = process.env.NODE_ENV === 'production',    // eslint-disable-line no-process-env
      cssLoader,
      cssModuleNames = isProduction ? `[hash:base64:5]` : `[name]---[local]`,
      cssParams = `?modules&localIdentName=${cssModuleNames}`;
  if (options.node) {
    cssLoader = `${require.resolve('css-loader/locals')}${cssParams}`;
  } else {
    cssLoader = `${require.resolve('style-loader')}!${require.resolve('css-loader')}${cssParams}`;
  }

  let ret = {
    target: options.node ? 'node' : 'web',
    entry: options.entry || {
      boostrap: CLIENT_ENTRY
    },
    output: {
      path: options.path || `${BUILD_TARGET}/$client$/`,
      filename: '[name].js',
      publicPath: '/static/',
      libraryTarget: options.node ? 'commonjs2' : 'var',
      pathinfo: !isProduction
    },

    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          exclude: /(node_modules(?!\/linoleum\/src)|bower_components)/,
          query: {
            plugins: [],
            ... BABEL_DEFAULTS,

            // Babel Loader does not support inline source maps that are being used elsewhere, so
            // we need to reset
            sourceMap: 'source-map'
          },
          babel: true
        },

        {
          test: /\.css$/,
          loader: cssLoader
        },

        {
          test: /\.json$/,
          loader: require.resolve('json-loader')
        },

        {
          test: /\/sinon\/.*\.js$/,
          loader: `${require.resolve('imports-loader')}?define=>false`
        }
      ],

      postLoaders: options.cover ? [{
        test: /\.jsx?$/,
        loader: require.resolve('./istanbul-instrumenter-loader'),
        exclude: /(test|node_modules|linoleum\/src)\//
      }] : []
    },

    plugins: [
      new webpack.NoErrorsPlugin()
    ],

    externals: options.node ? [
      // Every non-relative module is external
      // abc -> require("abc")
      /^[a-z\/\-0-9]+$/i
    ] : {
      sinon: 'sinon'
    },

    resolve: {
      alias: {
        project: process.cwd()
      },
      extensions: options.node
          ? ['', '.server.js', '.jsx', '.js']
          : ['', '.web.js', '.jsx', '.js']
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map'
  };

  // Strip development code
  if (isProduction) {
    ret.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: true,
        mangle: true
      })
    );
  }

  return ret;
}
