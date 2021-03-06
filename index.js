var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: 8080,
  routes: {cors: true}
});

var plugins = [
  {register: require('./routes/quotes.js')},
  {register: require('hapi-mongodb'),
   options: {
             "url":"mongodb://127.0.0.1/harry",
             "settings": {db: {"native_parser": false}}
            }
  }
];

server.register(plugins, function (err) {
  if (err) { throw err; }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });

});

server.start();