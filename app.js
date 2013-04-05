var express  = require('express'),
    http     = require('http'),
    _        = require('underscore'),
    cradle   = require('cradle'),
    parseURL = require('./lib/parse-cloudant-url'),
    app      = express(),
    db;

app.configure(function(){
  app.set('title', 'Inventory Management')
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.errorHandler());
  
  var couch = new(cradle.Connection)(process.env.DEVELOPMENT_COUCH);
  db = couch.database('inventory');
});

app.configure('production', function(){
  var url = parseURL(process.env.CLOUDANT_URL);
  var couch = new(cradle.Connection)(couch.url, 443, {
    secure: true,
    auth: _.omit(couch, 'url')
  });
  
  db = couch.database('inventory');
});

app.get('/', function(req, res) {
  db.view('items/all', function (err, items) {
    if (err) res.status(500).send(err);
    res.render('index', { title: app.get('title'), items: items });
  });
});

require('./routes/scripts')(app, db);
require('./routes/items')(app, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + "!");
});