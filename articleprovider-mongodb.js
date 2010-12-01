(function() {
  var ArticleProvider, Db, ObjectID, Server;
  Db = require('mongodb/db').Db;
  ObjectID = require('mongodb/bson/bson').ObjectID;
  Server = require('mongodb/connection').Server;
  ArticleProvider = function() {
    function ArticleProvider(host, port, dbName) {
      this.db = new Db(dbName, new Server(host, port, {
        auto_reconnect: true
      }, {}));
      this.db.open(function() {});
    }
    ArticleProvider.prototype.getCollection = function(callback) {
      return this.db.collection('articles', function(error, collection) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, collection);
        }
      });
    };
    ArticleProvider.prototype.findAll = function(callback) {
      return this.getCollection(function(error, collection) {
        if (error != null) {
          return callback(error);
        } else {
          return collection.find(function(error, cursor) {
            if (error != null) {
              return callback(error);
            } else {
              return cursor.toArray(function(error, results) {
                if (error != null) {
                  return callback(error);
                } else {
                  return callback(null, results);
                }
              });
            }
          });
        }
      });
    };
    ArticleProvider.prototype.findByID = function(id, callback) {
      return this.getCollection(function(error, collection) {
        if (error != null) {
          return callback(error);
        } else {
          return collection.findOne({
            _id: ObjectID.createFromHexString(id)
          }, function(error, result) {
            if (error != null) {
              return callback(error);
            } else {
              return callback(null, result);
            }
          });
        }
      });
    };
    ArticleProvider.prototype.save = function(articles, callback) {
      return this.getCollection(function(error, collection) {
        var article, _i, _len;
        if (error != null) {
          return callback(error);
        } else {
          if (typeof articles.length === "undefined") {
            articles = [articles];
          }
          for (_i = 0, _len = articles.length; _i < _len; _i++) {
            article = articles[_i];
            article.created_at = new Date();
          }
          return collection.insert(articles, function() {
            return callback(null, articles);
          });
        }
      });
    };
    return ArticleProvider;
  }();
  exports.ArticleProvider = ArticleProvider;
}).call(this);
