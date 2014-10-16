# loop-lag

A node module that sets an interval and checks to see how delayed that interval
was. This can be used as an approximate measure for long running operations
that block the node event loop.

## Example:

```
var looplag = require('loop-lag');

looplag(function (delay) {
  console.log("Loop delay (using 500ms timeouts) for last 2000ms is", delay.toFixed(2));
}, 500, 2000);


// simulate some lag with long running operations

var restify = require('restify');
var http = require('http');

function respond(req, res, next) {
  for(var i=0;i<999999999;i++) {
    // lock the event loop for a bit
    slow_down = i;
  }
  console.log("Doing a slow operation");
  res.send('hello');
}

var server = restify.createServer();
server.get('/hello', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
  http.request({host: 'localhost', port: '8080', path: '/hello'}, function() {}).end();
});
```

## Output:

```
restify listening at http://0.0.0.0:8080
got request
Loop maximum delay for last 2000 ms is approx 573.987
Loop maximum delay for last 2000 ms is approx 1.63
Loop maximum delay for last 2000 ms is approx 1.43
```
