var express = require('express');
var http    = require('http');
var cradle  = require('cradle');
var _       = require('underscore');

var app = express();

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
});

var couch = new(cradle.Connection)(process.env.couch);
var db = couch.database('inventory');

app.get('/', function(req, res) {
  db.view('items/all', function (err, items) {
    if (err) res.status(500).send(err);
    res.render('index', { title: 'Inventory Tracker', items: items });
  });
});

app.get('/create', function(req, res){
  res.render('create', { title: 'Add an item'});
});

app.post('/create', function(req, res){
  for (key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }
  res.send(req.body);
});

app.get('/items/:item', function(req, res){
  db.get(req.params.item, function (err, doc) {
    if (err) res.status(404).send(err);
    res.send(doc);
  });
});

app.get('/js/jquery.js', function(req, res){
  res.sendfile('./components/jquery/jquery.min.js');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port') + "!");
});