var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

var source = {
  templates: ['app/templates/**/*.hb']
}

gulp.task('browser-sync', function () {
   var files = [
      'public/**/*.html',
      'public/styles/**/*.css',
      'public/scripts/**/*.js'
   ];

   plugins.browserSync.init(files, {
      server: {
         baseDir: './public'
      }
   });
});

gulp.task('templates', function() {
  gulpHandlebars
});

gulp.task('watch', function(){
  gulp.watch(source.templates, ['templates']);
});

gulp.task('server', ['watch']);