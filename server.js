var express = require("express");
var pg = require('pg');

var pgConInfo = process.env.DATABASE_URL;

//var app = express(express.logger());

var app = express();

if ('production' == app.get('env')) {
  app.set('static dir', __dirname+'/public');
}else{
  app.set('static dir', __dirname+'/front/app');
  app.enable('dev styles');
  app.set('dev styles dir', __dirname+'/front/.tmp/styles');
}

console.log(app.get('static dir'));
console.log(app.get('dev styles dir'));
console.log(app.enabled('dev styles'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(app.get('static dir')));

if(app.enabled('dev styles')){
  app.use('/styles', express.static(app.get('dev styles dir')));
}

app.get("/candystatus", function(req, res, next){
  res.header("Content-Type", "application/json");
  var body = {};
  body.status = "no";
  
  pg.connect(pgConInfo, function(err, client, done){
    client.query('SELECT * FROM status WHERE name = \'candy\'', function(err, result) {
      body.status = result.rows[0].status;
      res.send(body);
      done();
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});