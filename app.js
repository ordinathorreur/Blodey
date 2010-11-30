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
        id: "1",
        title: "Article 1",
        body: "Article 1 body"
      }, {
        id: "2",
        title: "Article 2",
        body: "Article 2 body"
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
  app.get('/articles/new', function(req, res) {
    return res.render('articles_new');
  });
  app.get('/articles/:id', function(req, res) {
    var article, requestedArticle, _i, _len, _ref;
    _ref = Blog.data.articles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      article = _ref[_i];
      if (article.id === req.params.id) {
        requestedArticle = article;
        break;
      }
    }
    return res.render('articles_show', {
      locals: {
        article: requestedArticle
      }
    });
  });
  app.post('/articles', function(req, res) {
    console.log(req.body.article);
    if (req.body.article.title == null) {
      res.send("No title");
    }
    if (req.body.article.body == null) {
      res.send("No body");
    }
    return res.send("OK, we have article params");
  });
  app.listen(3000);
}).call(this);
