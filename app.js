(function() {
  var ArticleProvider, app, articleProvider, express;
  express = require("express");
  app = express.createServer();
  app.configure(function() {
    app.use(express.cookieDecoder());
    app.use(express.session());
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
      title: 'ArticleProvider Article one',
      body: 'Body one'
    }, {
      title: 'ArticleProvider Article two',
      body: 'Body two'
    }, {
      title: 'ArticleProvider Article three',
      body: 'Body three'
    }
  ], function(error, articles) {});
  app.dynamicHelpers({
    messages: function(req, res) {
      return function() {
        var messages;
        messages = req.flash();
        return res.partial('messages', {
          object: messages,
          as: 'types',
          locals: {
            hasMessages: Object.keys(messages).length
          },
          dynamicHelpers: false
        });
      };
    }
  });
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
    if (!((req.body.article.title != null) && (req.body.article.body != null))) {
      req.flash('info', 'Please enter a title and a body');
      return res.render('articles_new');
    } else {
      return articleProvider.save([
        {
          title: req.body.article.title,
          body: req.body.article.body
        }
      ], function(error, articles) {
        var lastArticleID;
        req.flash('info', 'You successfully created a new article');
        lastArticleID = articles[articles.length - 1]._id;
        return res.redirect("/articles/" + lastArticleID);
      });
    }
  });
  app.listen(3000);
}).call(this);
