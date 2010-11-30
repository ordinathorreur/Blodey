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
	articles:[{title: "Blog 1", body: "Blog 1 body"}, {title: "Blog 2",  body: "Blog 2 body"}]

## ROUTING

app.get('/', (req, res) ->
	res.render 'home_index',
		locals: {
			title: Blog.data.title
			articles: Blog.data.articles
		}
)

# Listen to port
app.listen 3000