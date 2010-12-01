# Adapted from: http://howtonode.org/express-mongodb
Db = require('mongodb/db').Db
ObjectID = require('mongodb/bson/bson').ObjectID
Server = require('mongodb/connection').Server

class ArticleProvider
	
	constructor: (host, port, dbName) ->
		@db = new Db(dbName, new Server(host, port, {auto_reconnect: true}, {}))
		@db.open () ->
	
	getCollection: (callback) ->
		@db.collection('articles', (error, collection) ->
			if error?
				callback error
			else
				callback null, collection
		)
	
	findAll: (callback) ->
		@getCollection((error, collection) ->
			if error?
				callback error
			else
				collection.find((error, cursor) ->
					if error?
						callback error
					else
						cursor.toArray((error, results) ->
							if error?
								callback error
							else
								callback null, results
						)
				)
		)
	
	findByID: (id, callback) ->
		@getCollection((error, collection) ->
			if error?
				callback error
			else
				collection.findOne({_id: ObjectID.createFromHexString(id)}, (error, result) ->
					if error?
						callback error
					else
						callback null, result
				)
		)
	
	save: (articles, callback) ->
		@getCollection((error, collection) ->
			if error?
				callback error
			else
				# check if single article or an array
				if typeof articles.length is "undefined"
					articles = [articles]
				for article in articles
					article.created_at = new Date()
				collection.insert(articles, () ->
					callback null, articles
				)
		)

exports.ArticleProvider = ArticleProvider