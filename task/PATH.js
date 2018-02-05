var join = require('path').join;

module.exports = {
  src: {
    toolchain:{
      root: './node_modules/oneleo-platform-toolchain-lite/' ,
      config: 'client-config/electron.client.config.json',
      electronmaker: 'electron-maker',
      electrondebug:'electron-debug'
    }
  },
  dest: 'dist/',
  dev: 'dev',
  prod: 'prod',
  config:'client-config',
  appclientfolder:'/electron-client-win32-ia32/'
 
  
}

