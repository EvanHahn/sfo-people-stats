const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const connect = require('connect')
const del = require('del')
const gulp = require('gulp')
const gutil = require('gulp-util')
const mkdirp = require('mkdirp')
const path = require('path')
const serveStatic = require('serve-static')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')

const DIST_PATH = path.join(__dirname, 'dist')
const JS_FILENAME = 'the.js'
const JS_PATH = path.join(__dirname, 'src', JS_FILENAME)
const STATIC_FILES = path.join(__dirname, 'static', '**')

gulp.task('clean', () => del(DIST_PATH))

gulp.task('create dist/', (done) => {
  mkdirp(DIST_PATH, done)
})

gulp.task('build javascripts', ['create dist/'], (done) => {
  const browserifyOptions = {}

  if (isProduction()) { browserifyOptions.debug = true }

  const b = browserify(browserifyOptions)

  b.add(JS_PATH)

  const bundle = b.bundle()
    .on('error', function (err) {
      gutil.log(gutil.colors.red('ERROR'), err.message)
      this.emit('end')
    })
    .pipe(source(JS_FILENAME))
    .pipe(buffer())

  if (isProduction()) {
    bundle.pipe(uglify())
  }

  bundle.pipe(gulp.dest(DIST_PATH))

  return bundle
})

gulp.task('copy static files', ['create dist/'], () => {
  return gulp.src(STATIC_FILES)
    .pipe(gulp.dest(DIST_PATH))
})

gulp.task('start dev server', ['create dist/'], (done) => {
  connect().use(serveStatic(DIST_PATH)).listen(8000, done)
})

gulp.task('watch dev files', () => {
  gulp.watch(STATIC_FILES, ['copy static files'])
})

gulp.task('build', [
  'build javascripts',
  'copy static files'
])

gulp.task('development', [
  'build',
  'start dev server',
  'watch dev files'
])

function isProduction () {
  return process.env.NODE_ENV === 'production'
}
