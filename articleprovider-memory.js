(function() {
  var ArticleProvider;
  ArticleProvider = function() {
    function ArticleProvider() {
      this.articleCounter = 1;
      this.dummyData = [];
    }
    ArticleProvider.prototype.findAll = function(callback) {
      return callback(null, this.dummyData);
    };
    ArticleProvider.prototype.findByID = function(id, callback) {
      var article, result, _i, _len, _ref;
      result = null;
      _ref = this.dummyData;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        article = _ref[_i];
        if (article._id === id) {
          result = article;
          break;
        }
      }
      return callback(null, result);
    };
    ArticleProvider.prototype.save = function(articles, callback) {
      var article, _i, _len;
      article = null;
      if (typeof articles.length === "undefined") {
        articles = [articles];
      }
      for (_i = 0, _len = articles.length; _i < _len; _i++) {
        article = articles[_i];
        article._id = (this.articleCounter++).toString();
        article.created_at = new Date();
        this.dummyData[this.dummyData.length] = article;
      }
      return callback(null, articles);
    };
    return ArticleProvider;
  }();
  exports.ArticleProvider = ArticleProvider;
}).call(this);
