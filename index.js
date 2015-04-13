var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
<<<<<<< HEAD
  host: '0.0.0.0',
  port: 8080,
  routes: {cors: true}
});

var plugins = [{ register: require('./routes/quotes.js') }];

server.register(plugins, function (err) {
  if (err) { throw err; }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
=======
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request,reply) {
    reply('hello world');
  }
>>>>>>> 95f40aa23a30fe0cd71ac7a06c9bd843a35333e5
});

server.start();