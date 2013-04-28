var express = require("express");

//var app = express(express.logger());

var app = express();

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(__dirname+'/public'));



var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});