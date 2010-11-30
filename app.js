(function() {
  var ArticleProvider, app, articleProvider, express;
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
  ArticleProvider = require('./articleprovider-memory').ArticleProvider;
  articleProvider = new ArticleProvider();
  articleProvider.save([
    {
      _id: "1",
      title: 'ArticleProvider Article one',
      body: 'Body one'
    }, {
      _id: "2",
      title: 'ArticleProvider Article two',
      body: 'Body two'
    }, {
      _id: "3",
      title: 'ArticleProvider Article three',
      body: 'Body three'
    }
  ], function(error, articles) {});
  app.get('/', function(req, res) {
    return articleProvider.findAll(function(error, articles) {
      return res.render('home_index', {
        locals: {
          title: "Main Blog Title",
          articles: articles
        }
      });
    });
  });
  app.get('/articles/new', function(req, res) {
    return res.render('articles_new');
  });
  app.get('/articles/:id', function(req, res) {
    return articleProvider.findByID(req.params.id, function(error, article) {
      if (article != null) {
        return res.render('articles_show', {
          locals: {
            article: article
          }
        });
      } else {
        return res.render('404', {
          status: 404
        });
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
    return articleProvider.save([
      {
        title: req.body.article.title,
        body: req.body.article.body
      }
    ], function(error, articles) {
      return res.send("OK, we have saved a new article");
    });
  });
  app.listen(3000);
}).call(this);
