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

Blog = {}
Blog.data =
	title: "Blog main title"
	articles:[{id: "1", title: "Article 1", body: "Article 1 body"}, {id: "2", title: "Article 2",  body: "Article 2 body"}]

## ROUTING

# Root
app.get('/', (req, res) ->
	res.render 'home_index',
		locals: {
			title: Blog.data.title
			articles: Blog.data.articles
		}
)

# GET /articles/new
app.get('/articles/new', (req, res) ->
	res.render 'articles_new'
)

# GET /articles/1
app.get('/articles/:id', (req, res) ->
	
	# Find the requested article
	for article in Blog.data.articles
		if article.id is req.params.id
			requestedArticle = article
			break

	# render the template
	res.render 'articles_show',
		locals: {
			article: requestedArticle
		}
)

# POST /articles
app.post('/articles', (req, res) ->
	
	# log the article params to the console
	console.log req.body.article;
	
	# do some simple validation
	res.send "No title" unless req.body.article.title?
	res.send "No body" unless req.body.article.body?
	
	# now create a new article	
	res.send "OK, we have article params"
)

# Listen to port
app.listen 3000