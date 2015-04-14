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
      path: '/{collect}',
      handler: function (request, reply) {
        var collect = encodeURIComponent(request.params.collect);
             var db = request.server.plugins['hapi-mongodb'].db;
        db.collection(collect).find().toArray(function(err, result){
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
      path: '/{collect}',
      handler: function (request, reply) {
         var collect = encodeURIComponent(request.params.collect);
        var newQuote = request.payload.quote;
              var db = request.server.plugins['hapi-mongodb'].db;
        db.collection(collect).insert( newQuote, function(err, writeResult){
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
      path: '/{collect}/{id}',
      handler: function (request, reply) {
         var collect = encodeURIComponent(request.params.collect);
              var id = encodeURIComponent(request.params.id);
              var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        var modQuote = request.payload.quote;
        db.collection(collect).update( {"_id" : ObjectID(id)}, { '$set': modQuote}, function(err, writeResult){
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
      path: '/{collect}/{id}',
      handler: function (request, reply) {
         var collect = encodeURIComponent(request.params.collect);
              var id = encodeURIComponent(request.params.id);
              var db = request.server.plugins['hapi-mongodb'].db;
        var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
        db.collection(collect).remove( {"_id" : ObjectID(id)}, function(err, writeResult){
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
    // search quotes with a keyword
    {
      method: 'GET',
      path: '/quotes/search/{keyword}',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db; 
        var keyword = { "$text": { "$search": request.params.keyword} };
        db.collection('quotes').find(keyword).toArray(function(err, result){
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