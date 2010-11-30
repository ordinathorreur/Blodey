(function() {
  var app, express;
  express = require("express");
  app = express.createServer();
  app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
    return app.set('view engine', 'ejs');
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('home_index', {
      locals: {
        title: "Some title"
      }
    });
  });
  app.listen(3000);
}).call(this);
