#!/usr/bin/env node

var util = require('util')
  , Client = require('..')
  , clc = require('cli-color')
  , optimist = require('optimist')
            .options({
              host: {
                default : '127.0.0.1',
                describe: 'host to bind to'
              },
              port: {
                default : 8080,
                describe: 'port to bind to'
              },
              register: {
                describe: 'name@x.x.x:port,name@x.x.x:port'
              },
              debug: {
                boolean: true,
                describe: 'enabled debug logging'
              },
              showhelp: {
                alias: 'h'
              }
            })
            .demand('register');

var argv = optimist.argv;

if (argv.h) {
  optimist.showHelp();
  process.exit(0);
}

//
// A simple logger
//
var filterLevel = (argv.debug == true) ? 'debug' : 'error'
  , levelColors = { debug: clc.blue, info: clc.yellow, error: clc.red }
  , levels = { debug: 0, info: 1, error: 2 }
  , sep = ' - ';
var log = argv.log = function (level, message, meta) {
  if (levels[level] >= levels[filterLevel]) {
    var optMeta = (meta) ? sep + JSON.stringify(meta) : '';
    console.log((levelColors[level] || clc.white)(level) + sep +  message + optMeta);
  }
}

var client = new Client(argv);

// TODO validate format of `register` option
argv.register.split(',').forEach(function (nvp) {
  var parts = nvp.split('@');
  var name = parts[0];
  parts = parts[1].split(':');
  var version = parts[0];
  var port = parts[1];
  client.register(name, version, port);
  log('info', util.format('registering %s@%s on port %s', name, version, port));
})

client.start();