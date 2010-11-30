express = (require "express")
app = express.createServer()

## CONFIG

# General Config
app.configure(()->
	app.use express.methodOverride()
	app.use express.bodyDecoder()
	app.use app.router
	app.use express.staticProvider(__dirname + '/public')
)
# Development Environment Config
app.configure('development', () ->
    app.use express.errorHandler({ dumpExceptions: true, showStack: true })
)
# Production Environmnet Config
app.configure('development', () ->
    app.use express.errorHandler()
)

## ROUTING

app.get('/', (req, res) ->
	res.send 'hello world'
)

# Listen to port
app.listen 3000