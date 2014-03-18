Thalassa Client
====================

A lightweight client for [Thalassa](https://github.com/PearsonEducation/thalassa)

# Running the Client

The client can be run any of three ways.

1. From the command-line
2. As a module
3. Over HTTP

## Running Client from Command Line

Why would you do this? Let's say you have an existing legacy Java application that you'd rather not change. You can create a sister service that invokes the command line client to register the service on it's behalf.

For example, if Thalassa is installed globally (other wise `./node_modules/.bin/thalassa-client):

    thalassa-client --register myapp@1.0.0:8080 --debug

This registers the application named `my app` at version `1.0.0` that's on the current host on port `8080`. The client will continue to ping the Thalassa server with updates.

### Client Command Line Options

    thalassa-client --help
      Options:
        --host           thalassa host                                                    [default: "127.0.0.1"]
        --apiport        thalassa http api port                                           [default: 9000]
        --register       name@x.x.x:port,name@x.x.x:port                                  [required]
        --secsToExpire   default time in seconds for a thalassa registration to be valid  [default: 60]
        --updateFreq     time frequency in ms to ping the thalassa server                 [default: 20000]
        --updateTimeout  time in ms to wait for a registration request to respond         [default: 2500]
        --debug          enabled debug logging

## Client as an Embedded Module

Using the client from within a node.js application to register your service is simple. Pass options via the `opts` object like `new Thalassa.Client(opts)`:

    var Thalassa = require('thalassa');

    var client = new Thalassa.Client({
      apiport: 4445,
      host: 'localhost'
    });

    client.register('myapp', '1.0.0', 8080);

    // start reporting registrations to the server
    client.start();

    // stop reporting registrations to the server
    client.stop();

`opts.log` may be passed just like the server.

### `updateSuccessful` and `updateFailed` Events

The client will periodically check in with the Thalassa server according to `opts.updateFreq` (default 5000ms). Each registration will product a `updateSuccessful` or `updateFailed` event to be emitted.

  client.on('updateSuccessful', function () {});
  client.on('updateFailed', function (error) {});

### Querying Registrations

Also as a module, you can use the client API to query for registrations.

    client.getRegistrations('myapp', '1.0.0', function (err, registrations) {
        // registrations is an Array of Registrations
    }
See the HTTP API section for the `Registration` structure.

### Metadata

You can also pass metadata with any registration as a fourth parameter. This can be any javascript object with properties. For example:

    var meta = {
        az: 'use1a',
        size: 'm1.large',
        foo: {
            bar: 'baz'
        }
    };
    client.register('myapp', '1.0.0', 8080, meta)

# License

Licensed under Apache 2.0. See [LICENSE](https://github.com/PearsonEducation/thalassa-http-clien/blob/master/LICENSE) file.
