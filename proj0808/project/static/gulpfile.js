const
  gulp = require('gulp'),
  babel = require('gulp-babel'),
  watch = require( 'gulp-watch' ),
  nodeNotifier = require( 'node-notifier' ),
  plumber = require( 'gulp-plumber' ),
  path = require('path'),
  del = require( 'del' ),

  srcPath = './src',
  jsSrcPath = srcPath + '/js',
  buildPath = './build',
  jsBuildPath = buildPath + '/js';


function getTaskName(taskName) {
  return `${taskName}`.toUpperCase();
}

function logError(error) {
  console.error( `ERROR - ${error.plugin}\nTYPE: ${error.name}\nMESSAGE: ${error.message}` );

  nodeNotifier.notify( {
    // icon: path.join( process.cwd(),  'assets/gulp-error.png' ),
    title: `ERROR - ${error.plugin}`,
    message: `TYPE: ${error.name}\nMESSAGE: ${error.message}`,
    sticky: true
  } );
}

function notifyOnTaskFinish(taskName) {
  nodeNotifier.notify( {
    title: getTaskName( taskName ),
    // icon: path.join( process.cwd(),  'assets/gulp.png' ),
    message: 'FINISHED'
  } );

  console.info( `${getTaskName( taskName )} FINISHED` );
}

function getPlumber() {
  return plumber( { errorHandler: logError } );
}

function clean() {
  del.sync( `${buildPath}/**/*` );
}

function buildJS() {
  return gulp
    .src( `${jsSrcPath}/**/*.+(js|jsx)` )
    .pipe( getPlumber() )
    .pipe( babel() )
    .pipe( gulp.dest( jsBuildPath ) )
    .on( 'end', () => notifyOnTaskFinish( 'babel' ) );
}

function watchJS() {
  return watch( `${jsSrcPath}/**/*.+(js|jsx)`, {
      readDelay: 100,
      name: getTaskName( 'babel' ),
      verbose: true,
      ignoreInitial: true
    } )
    .pipe( getPlumber() )
    .pipe( babel() )
    .pipe( gulp.dest( jsBuildPath ) )
    .on( 'data', () => notifyOnTaskFinish( 'babel' ) );
}

gulp.task( 'clean', clean );

gulp.task( 'build-js', buildJS );

gulp.task( 'build', ['clean', 'build-js'] );

gulp.task( 'watch-js', watchJS );

gulp.task( 'default', ['build', 'watch-js'] );
