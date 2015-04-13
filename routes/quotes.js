exports.register = function(server, options, next) {
  
  //   here will go our routes for the API
  server.route([
    // HELLO WORLD
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply("Hello, I'm an awesome HarryQuote API Server!!");
      }
    },
    // Get all the quotes
    {
      method: 'GET',
      path: '/quotes',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('quotes').find().toArray(function(err, result){
          if (err) throw err;
          reply(result);
        });
      }
    },
    // Get one quote
    {
      method: 'GET',
      path: '/quotes/{id}',
      handler: function (request, reply) {
              var id = encodeURIComponent(request.params.id);
              var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        db.collection('quotes').findOne( {"_id" : ObjectID(id)}, function(err, quote){
          if(err) throw err;
          reply(quote);
        });
      }
    },
    // POST a quote
    {
      method: 'POST',
      path: '/quotes',
      handler: function (request, reply) {
        var newQuote = request.payload.quote;
              var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('quotes').insert( newQuote, function(err, writeResult){
          if(err) {
            reply(Hapi.error.internal('Internal MongoDB Error', err));
          } else {
            reply(writeResult);
          }
        })
      }
    },
    // PUT edit a quote
    {
      method: 'PUT',
      path: '/quotes/{id}',
      handler: function (request, reply) {
              var id = encodeURIComponent(request.params.id);
              var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var modQuote = request.payload.quote;
        db.collection('quotes').update( {"_id" : ObjectID(id)}, { '$set': modQuote}, function(err, writeResult){
          if(err) {
            reply(Hapi.error.internal('Internal MongoDB Error', err));
          } else {
            reply(writeResult);
          }
        })
      }
    },
    // DELETE a quote
    {
      method: 'DELETE',
      path: '/quotes/{id}',
      handler: function (request, reply) {
              var id = encodeURIComponent(request.params.id);
              var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        db.collection('quotes').remove( {"_id" : ObjectID(id)}, function(err, writeResult){
          if(err) {
            reply(Hapi.error.internal('Internal MongoDB Error', err));
          } else {
            reply(writeResult);
          }
        })
      }
    },
    // Get a random quote
    {
      method: 'GET',
      path: '/quotes/random',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db; 
        db.collection('quotes').find().toArray(function(err, result){
          if (err) throw err;
          var allQuotes = result;
          var randomQuote = Math.floor(Math.random() * allQuotes.length);
          var quote = allQuotes[randomQuote];
          reply(quote);
        });
      }
    },
    {
      method: 'GET',
      path: '/quotes/search/{keyword}',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db; 
        var keyword = encodeURIComponent(request.params.keyword);
        db.collection('quotes').find({"quote": {$regex: keyword} }).toArray(function(err, result){
          if (err) throw err;
          reply(result);
        });
      }
    }   
  ]);
  next();
}

exports.register.attributes = {
  name: 'quotes-route',
  version: '0.0.1'
}