var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();
    browserSync = require('browser-sync').create();

var source = {
  indexTemplate: 'app/index.hbs',
  templates: 'app/templates/**/*.hbs',
  typescripts: 'app/scripts/**/*.ts',
  jsscripts: 'app/scripts/**/*.js',
  styles: 'app/styles/**/*.styl'
}

 var dest = [
    'public/**/*.html',
    'public/styles/**/*.css',
    'public/scripts/**/*.js',
    'public/templates/**/*/js'
 ];

gulp.task('browserSync', function () {
   browserSync.init(dest, {
      server: {
         baseDir: './public'
      }
   });
});

gulp.task('templates', function() {
  gulp.src(source.templates)
    .pipe(plugins.handlebars())
    .pipe(plugins.wrap('Handlebars.templates(<%= contents %>)'))
    .pipe(plugins.declare({
      namespace: 'CC.templates',
      noRedeclare: true
    }))
    .pipe(plugins.concat('templates.js'))
    .pipe(gulp.dest('public/templates/'))
});

gulp.task('indexTemplate', function() {
  gulp.src(source.indexTemplate)
    .pipe(plugins.compileHandlebars())
    .pipe(plugins.rename('index.html'))
    .pipe(gulp.dest('public'))
});

gulp.task('scripts', function() {
  gulp.src(source.typescripts)
    .pipe(plugins.typescript({
      noImplicitAny: true,
      out: 'main.js'
    }))
    .pipe(gulp.dest('public/scripts/'))

  gulp.src(source.jsscripts)
    .pipe(plugins.concat('reactTests.js'))
    .pipe(gulp.dest('public/scripts/'))

});

gulp.task('styles', function() {
  gulp.src(source.styles)
    .pipe(plugins.stylus())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('public/styles/'))
});

gulp.task('watch', function() {
  gulp.watch(source.scripts, ['scripts']);
  gulp.watch(source.templates, ['templates']);
  gulp.watch(source.indexTemplate, ['indexTemplate']);
});

gulp.task('build', ['indexTemplate', 'templates', 'scripts', 'styles'], browserSync.reload);
gulp.task('server', ['browserSync','build','watch']);
