'use strict';

var PATH = require('./PATH');
var del = require('del');
var install = require("gulp-install");

var gulp = require('gulp');
var runSequence = require('run-sequence');
var yargs = require('yargs');
var path = require('path');
var join = path.join;

var electron_pack = require('electron-packager')
var dest=PATH.dest;


registerElectronEnvPkgTasks();

function registerElectronEnvPkgTasks() {
  ['dev', 'prod'].forEach(function (env) {
 

    gulp.task(['clean', 'pkg', env].join('.'), function (done) {
      del( dest+ env, done).then(function () {
        done();
      });
    });
    
    gulp.task(['clean', 'electronmaker','folder', env].join('.'), function (done) {
      del( PATH.src.toolchain.root+PATH.src.toolchain.electronmaker+'-dev/node_modules', done).then(function () {
        done();
      });
    });
    
     gulp.task(['copy', 'client', 'config',env].join('.'), function (done) {
      return gulp.src(PATH.src.toolchain.root+PATH.src.toolchain.config)
        .pipe(gulp.dest(dest+env+PATH.appclientfolder+PATH.config));
    });
    
       gulp.task(['client', 'config','install','electrondebug','dev'].join('.'), function (done) {
      return gulp.src(PATH.src.toolchain.root+PATH.src.toolchain.electrondebug+'/package.json')
        .pipe(install());
    });
    
    gulp.task(['copy', 'config','install','electrondebug','dev'].join('.'), function (done) {
      return gulp.src(PATH.src.toolchain.root+PATH.src.toolchain.electrondebug+'/node_modules/**')
        .pipe(gulp.dest(PATH.src.toolchain.root+PATH.src.toolchain.electronmaker+'-dev/node_modules'));
    });
    
      gulp.task(['client', 'config','install','electrondebug','prod'].join('.'), function (done) {
      done();
    });
    
      gulp.task(['copy', 'config','install','electrondebug','prod'].join('.'), function (done) {
      done();
    });

    var taskName = ['package', 'electron', env, 'win32'].join('.');
    gulp.task(taskName,
      function (done) {
        var argv = yargs.reset()
          .usage('Usage: gulp ' + taskName + ' -n <appname>')
          .alias('n', 'name')
          .string('n')
          .default('n', 'electron-client')
          .describe('n', 'Application Name')

          .alias('b', 'buildNumber')
          .string('b')
          .describe('b', 'build number')
          .default('0')

          .alias('s', 'support')
          .help('s')
          .argv;

   
        var options = {
          name: argv.name,
          appname: argv.name,
          'app-version': '1.0',
          'app-copyright': 'by..',
          'build-version': argv.buildNumber || '1',
          'version-string': {
            CompanyName: 'company name',
            FileDescription: 'file description',
            OriginalFilename: 'original file name',
            ProductName: 'product name',
            InternalName: 'internal name'
          },

         
          dir: PATH.src.toolchain.root + PATH.src.toolchain.electronmaker+"-"+env,
          out: dest+ env,
          platform: 'win32',
          arch: 'ia32',
          prune: true,
          overwrite: true,
          asar: true
        };


        electron_pack(options, function done_callback(err, appPaths) { if (err) { console.log(err) } else { console.log(appPaths); done(); } });
      });


  });
}


function electronTask(done) {
  var argv = yargs.reset()
    .usage('Usage: gulp electron -n <appname> -o <win32 | win64> [-e <dev | prod>]')
    .alias('n', 'name')
    .string('n')
    .default('n', 'electron-client')
    .describe('n', 'Application Name')

    .alias('e', 'env')
    .string('e')
    .default('e', 'dev')
    .choices('e', ['dev', 'prod'])
    .describe('e', 'Target environment')

    .alias('a', 'asar')
    .boolean('a')
    .default('a', true)
    .describe('a', 'Package as Asar archive')

    .alias('o', 'os')
    .choices('os', ['win32', 'win64', 'macosx'])
    .describe('os', 'Target platform')
    .default('o', 'win32')


    .alias('b', 'buildNumber')
    .string('b')
    .describe('b', 'build number')
    .default('0')

    .alias('s', 'support')
    .help('s')
    .argv;

  var asar = argv.asar;


  var mode = argv.env;


  var taskInSequence = [
    ['clean', 'pkg', mode].join('.'),
    ['clean', 'electronmaker','folder', mode].join('.'),
    ['client', 'config','install','electrondebug',mode].join('.'),
    ['copy', 'config','install','electrondebug',mode].join('.'),
    ['package', 'electron', mode, argv.os].join('.'),
    ['copy', 'client', 'config',mode].join('.'),
    done
  ];


  runSequence.apply(null, taskInSequence);
}

electronTask.description = 'Package Electron application for the specified environment/platform';

electronTask.flags = {
  '-a, --asar': 'Package as Asar archive',
  '-n, --name': 'Application Name',
  '-e, --env': 'Target environment',
  '-o, --os': 'Target platform',
  '-s, --support': 'Show help'
};

gulp.task('electron', electronTask);
