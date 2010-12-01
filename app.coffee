express = (require "express")

app = express.createServer()

## CONFIG

# General Config
app.configure(()->
	# for cookie based sessions
	app.use express.cookieDecoder() 
	app.use express.session() 
	
	app.use express.methodOverride()
	app.use express.bodyDecoder()
	app.use app.router
	app.use express.staticProvider(__dirname + '/public')

	# sets up the default templating language
	app.set 'view engine', 'ejs'
)
# Development Environment Config
app.configure('development', () ->
	app.use express.errorHandler({ dumpExceptions: true, showStack: true })
)
# Production Environmnet Config
app.configure('development', () ->
	app.use express.errorHandler()
)

## DATA
ArticleProvider = require('./articleprovider-memory').ArticleProvider
articleProvider = new ArticleProvider()
articleProvider.save([
  {title: 'ArticleProvider Article one', body: 'Body one'},
  {title: 'ArticleProvider Article two', body: 'Body two'},
  {title: 'ArticleProvider Article three', body: 'Body three'}
], (error, articles) ->)

## DYNAMIC HELPERS

# Dynamic helpers are functions which are executed
# on each view render, unless dynamicHelpers is false.
# 
# So for example we do not need to call messages() in our
# template, "messages" will be populated with the return
# value of this function.
app.dynamicHelpers(
	messages: (req, res) ->
		# In the case of flash messages, we return a function, allowing flash messages to only be flushed when called.
		# Otherwise every request will flush flash messages regardless.
		() ->
			# Grab the flash messages
			messages = req.flash()
			# render the messsages partial
			res.partial('messages', {
				# target object is our messages
				object: messages,
				# We want it to be named "types" in the partial since they are keyed like this:
				# e.g. { info: ['foo'], error: ['bar']}
				as: 'types',
				# pass a local 'hasMessages so we can easily check if we have any messages
				locals: {	hasMessages: Object.keys(messages).length	},
				# Don't want dynamic helpers in the messages partial as that would cause infinite recursion
				dynamicHelpers: false
			})
)

## ROUTING

# Root
app.get('/', (req, res) ->
	articleProvider.findAll( (error, articles) ->
		res.render 'home_index',
		locals: {
			title: "Main Blog Title"
			articles: articles
		}
  )

)

# GET /articles/new
app.get('/articles/new', (req, res) ->
	res.render 'articles_new'
)

# GET /articles/1
app.get('/articles/:id', (req, res) ->
	
	# find and render the article in the callback
	articleProvider.findByID(req.params.id, (error, article)->
		if article?
			# render the template
			res.render 'articles_show',
				locals: {	article: article }
		else
			res.render '404', status: 404
	)
		
)

# POST /articles
app.post('/articles', (req, res) ->

	unless req.body.article.title? and req.body.article.body?
		req.flash 'info', 'Please enter a title and a body'
		res.render 'articles_new'
	else
		articleProvider.save([{title: req.body.article.title, body: req.body.article.body}], 
		(error, articles) -> 
			req.flash 'info', 'You successfully created a new article'
			lastArticleID = articles[articles.length-1]._id
			res.redirect("/articles/#{lastArticleID}")
		)
)

# Listen to port
app.listen 3000