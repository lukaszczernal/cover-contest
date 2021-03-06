var gulp = require('gulp'),
    es = require('event-stream'),
    plugins = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    nib = require('nib');


var source = {
  assets: 'app/assets/**/*',
  indexTemplate: 'app/index.hbs',
  templates: 'app/templates/**/*.hbs',
  typescripts: 'app/scripts/**/*.ts',
  jsscripts: 'app/scripts/**/*.js',
  jsxscripts: 'app/scripts/**/*.jsx',
  coffeescripts: 'app/scripts/**/*.coffee',
  styles: 'app/styles/*.styl'
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
         baseDir: ["./", "./public"]
      }
   });
});

gulp.task('templates', function() {
  gulp.src(source.templates)
    .pipe(plugins.handlebars())
    .pipe(plugins.wrap('Handlebars.template(<%= contents %>)'))
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

gulp.task('bower', function() {
    gulp.src(source.indexTemplate)
        .pipe(plugins.htmlbuild({
            bowerJS: plugins.htmlbuild.preprocess.js(function (block) {
                    block.pipe(gulpSrc())
                        .pipe(build('bower.js', 'public/scripts/'));
                    block.write('scripts/bower.js');
                    block.end();
                }),
            bowerCSS: plugins.htmlbuild.preprocess.css(function (block) {
                    block.pipe(gulpSrc())
                        .pipe(build('bower.css', 'public/styles/'));
                    block.write('styles/bower.css');
                    block.end();
                })
        }))
        .pipe(plugins.compileHandlebars())
        .pipe(plugins.rename('index.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('scripts', function() {

  gulp.src(source.jsscripts)
    .pipe(plugins.concat('javascript.js'))
    .pipe(gulp.dest('public/scripts/'))

  gulp.src(source.typescripts)
    .pipe(plugins.typescript({
      noImplicitAny: true,
      out: 'typescript.js'
    }))
    .pipe(gulp.dest('public/scripts/'))

  gulp.src(source.coffeescripts)
    .pipe(plugins.coffee({bare:true}))
    .pipe(plugins.concat('coffee.js'))
    .pipe(gulp.dest('public/scripts/'))

  gulp.src(source.jsxscripts)
    .pipe(plugins.react())
    .pipe(plugins.concat('jsx.js'))
    .pipe(gulp.dest('public/scripts/'))

});

gulp.task('styles', function() {
  gulp.src(source.styles)
    .pipe(plugins.stylus({use: nib(), import: ['nib']}))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('public/styles/'))
});

gulp.task('assets', function() {
  gulp.src(source.assets)
    .pipe(plugins.copy('public/', {prefix:2}))
});

gulp.task('watch', function() {
  gulp.watch([source.typescripts, source.jsscripts, source.jsxscripts, source.coffeescripts], ['scripts']);
  gulp.watch('app/styles/**/*.styl', ['styles']);
  gulp.watch(source.assets, ['assets']);
  gulp.watch(source.templates, ['templates']);
  gulp.watch(source.indexTemplate, ['indexTemplate']);
});

gulp.task('develop', ['indexTemplate', 'templates', 'scripts', 'styles', 'assets'], browserSync.reload);
gulp.task('build', ['templates', 'scripts', 'styles', 'assets', 'bower']);
gulp.task('serve', ['browserSync', 'develop', 'watch']);

// function copied from https://www.npmjs.com/package/gulp-htmlbuild
function gulpSrc(opts) {
    var paths = es.through();
    var files = es.through();

    paths.pipe(es.writeArray(function (err, srcs) {
        gulp.src(srcs, opts).pipe(files);
    }));

    return es.duplex(paths, files);
};

//TODO add minification
function build(file, dest) {
    return es.pipeline(
        plugins.concat(file),
        gulp.dest(dest)
    );
}
