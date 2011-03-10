This is the start of a node-based blog. You can add articles and view them, but there's no authentication right now. Feel free to add it and make a pull request.

Install Node.js and npm (node package manager)

Then use npm to install some other dependencies:

  npm install express
  npm install ejs
  npm install mongodb
  npm install coffee-script

To compilerate those coffeescripts:

  coffee - c *.coffee

Then kick off the party:

  node app.js
