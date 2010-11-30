# Adapted from an idea over at: http://howtonode.org/express-mongodb
class ArticleProvider
	
	constructor: () ->
		@articleCounter = 1
		@dummyData = []

	findAll: (callback) ->
		callback(null, @dummyData)
	
	findByID: (id, callback) ->
		result = null
		for article in @dummyData
			if article._id is id
				result = article
				break
		callback(null, result)
	
	save: (articles, callback) ->
		article = null
		# check if single article or an array
		if typeof articles.length is "undefined"
			articles = [articles]
		for article in articles
			article._id = (@articleCounter++).toString()
			article.created_at = new Date()
			@dummyData[@dummyData.length] = article
		callback(null, articles)

exports.ArticleProvider = ArticleProvider