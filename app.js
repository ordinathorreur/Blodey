(function() {
  var Blog, app, express;
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
  Blog = {};
  Blog.data = {
    title: "Blog main title",
    articles: [
      {
        title: "Blog 1",
        body: "Blog 1 body"
      }, {
        title: "Blog 2",
        body: "Blog 2 body"
      }
    ]
  };
  app.get('/', function(req, res) {
    return res.render('home_index', {
      locals: {
        title: Blog.data.title,
        articles: Blog.data.articles
      }
    });
  });
  app.listen(3000);
}).call(this);
