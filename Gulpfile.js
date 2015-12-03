var Gulp = require('gulp'),

    Linoleum = require('linoleum');

var $jsFiles = Linoleum.jsFiles;
Linoleum.jsFiles = function() {
  return $jsFiles().concat('tasks/*.js', 'index.js');
};

require('linoleum/tasks/clean');
require('linoleum/tasks/lint');
require('linoleum/tasks/cover');
require('./index');

Gulp.task('build', ['clean', 'lint'], function(done) {
  Linoleum.runTask('webpack:electron', done);
});
Gulp.task('cover', ['build'], function(done) {
  Linoleum.runTask(['cover:untested', 'cover:electron', 'cover:report'], done);
});

Linoleum.watch(Linoleum.jsFiles(), 'cover');

Gulp.task('travis', function(done) {
  // These need to be run in series to prevent issues with error tracking
  Linoleum.runTask(['cover'], done);
});
Gulp.task('default', ['cover']);

