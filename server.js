var static = require('node-static');

var port = 8080;
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./game');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(port);

console.log("Webserver Started on Port "+8080);