var express = require('express'),
	path 	= require('path');
	
var app = express();

app.use(express.static('examples'));

var server = app.listen(3007, 'localhost', function () {
    var host = server.address().host;
    var port = server.address().port;

    console.log('App listening at http://localhost:3007');
});