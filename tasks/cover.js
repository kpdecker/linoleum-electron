import Gulp from 'gulp';

import {BUILD_TARGET, COVERAGE_TARGET} from '@kpdecker/linoleum/config';

import {spawn} from 'child_process';
import {resolve} from 'path';
import electronPath from 'electron-prebuilt';

Gulp.task('cover:electron', function(done) {
  spawn(electronPath, [
      `-r`, require.resolve('@kpdecker/linoleum/runtime-init'),
      resolve(`${__dirname}/../electron/index.js`),
      resolve(`${BUILD_TARGET}/$cover$/main.js`),
      resolve(`${BUILD_TARGET}/$cover$/renderer.js`),
      resolve(`${COVERAGE_TARGET}/electron`)
    ], {stdio: 'inherit'})
    .on('close', (code) => {
      if (code) {
        done(new Error(`Electron failed with code: ${code}`));
      } else {
        done();
      }
    });
});
