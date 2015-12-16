import Gulp from 'gulp';
import GUtil from 'gulp-util';
import webpack from 'webpack';

import {BUILD_TARGET, WATCHING} from '@kpdecker/linoleum/config';
import loadWebpackConfig from '../src/webpack';

Gulp.task('webpack:electron', function(done) {
  let main = loadWebpackConfig({
        electron: true,
        node: true,
        entry: {main: './src/index'},
        path: `${BUILD_TARGET}/`
      }),
      renderer = loadWebpackConfig({
        electron: true,
        entry: {renderer: './src/bootstrap'},
        path: `${BUILD_TARGET}/`
      }),
      coverMain = loadWebpackConfig({
        electron: true,
        node: true,
        cover: true,
        entry: {main: require.resolve('@kpdecker/linoleum-webpack/src/webpack-server-test')},
        path: `${BUILD_TARGET}/$cover$/`
      }),
      coverRenderer = loadWebpackConfig({
        electron: true,
        cover: true,
        entry: {renderer: require.resolve('@kpdecker/linoleum-webpack/src/webpack-web-test')},
        path: `${BUILD_TARGET}/$cover$/`
      });

  webpack([main, renderer, coverMain, coverRenderer], handleWebpack(done));
});

function handleWebpack(done) {
  return function(err, stats) {
    if (err) {
      throw new GUtil.PluginError('webpack', err);
    }
    GUtil.log('[webpack]', stats.toString({
      chunks: !WATCHING
    }));

    let hasErrors = (stats.stats || [stats]).reduce((prev, stat) => prev || stat.hasErrors(), false);
    if (hasErrors) {
      done(new GUtil.PluginError('webpack', 'Build completed with errors'));
    } else {
      done();
    }
  };
}
