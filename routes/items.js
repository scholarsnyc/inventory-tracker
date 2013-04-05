module.exports = function(app, db) {
  app.get('/create', function(req, res){
    res.render('create', {  title: 'Add an Item' });
  });

  app.post('/create', function(req, res){
    for (key in req.body) {
      if (req.body[key] === "") delete req.body[key];
    }
    db.save(req.body, function (err, item){
      if (err) res.status(500).send(err);
      res.send(item);
    });
  });

  app.get('/items/:item', function(req, res){
    db.get(req.params.item, function (err, item) {
      if (err) res.status(404).send(err);
      res.render('item', { title: item._id, item: item });
    });
  });
}