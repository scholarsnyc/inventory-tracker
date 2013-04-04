module.exports = function(url) {
  var parts = url.match(/https{0,1}:\/\/(.*):(.*)@(.*)/);
  
  return {
    username: parts[1],
    password: parts[2],
    url: parts[3]
  }
}