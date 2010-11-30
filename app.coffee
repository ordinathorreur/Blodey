express = (require "express")

app = express.createServer()

## CONFIG

# General Config
app.configure(()->
	app.use express.methodOverride()
	app.use express.bodyDecoder()
	app.use app.router
	app.use express.staticProvider(__dirname + '/public')
	app.set('view engine', 'ejs')
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
  {_id: "1", title: 'ArticleProvider Article one', body: 'Body one'},
  {_id: "2", title: 'ArticleProvider Article two', body: 'Body two'},
  {_id: "3", title: 'ArticleProvider Article three', body: 'Body three'}
], (error, articles) ->)

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
				locals: {
					article: article
				}
		else
			res.render '404', status: 404
	)
		
)

# POST /articles
app.post('/articles', (req, res) ->
	
	# log the article params to the console
	console.log req.body.article;
	
	# do some simple validation
	res.send "No title" unless req.body.article.title?
	res.send "No body" unless req.body.article.body?
	
	articleProvider.save([{title: req.body.article.title, body: req.body.article.body}], 
	(error, articles) -> res.send "OK, we have saved a new article"
	)

)

# Listen to port
app.listen 3000