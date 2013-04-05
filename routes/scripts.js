module.exports = function(app){
  app.get('/js/jquery.js', function(req, res){
    res.sendfile('./components/jquery/jquery.min.js');
  });
  
  app.get('/js/modernizr.js', function(req, res){
    res.sendfile('./components/modernizr/modernizr.js');
  });
}