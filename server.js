var express = require("express");
var pg = require('pg');

var pgConInfo = process.env.DATABASE_URL;

//var app = express(express.logger());

var app = express();

app.set('env', process.env.NODE_ENV);

if ('production' == app.get('env')) {
  app.set('static dir', __dirname+'/public');
}else{
  app.set('static dir', __dirname+'/front/app');
  app.enable('dev styles');
  app.set('dev styles dir', __dirname+'/front/.tmp/styles');
}

//UNSAFE but quick
app.set('adminpass', 'iknowthisisbad');

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

  pg.connect(pgConInfo, function(err, client, done){
    client.query('SELECT * FROM status WHERE name = \'candy\'', function(err, result) {
      if(!err){
        body.ok = true;
        body.status = result.rows[0].status;
        res.send(body);
      }else{
        body.ok = false;
        body.err = err;
        res.send(body);
      }
      done();
    });
  });
});

app.get('/new_question', function (req, res, next) {
  res.header("Content-Type", "application/json");
  var body = {};

  pg.connect(pgConInfo, function(err, client, done){

    //GET ALL QUESTIONS
    client.query('SELECT * FROM questions WHERE enabled=TRUE;', function(err, result) {
      if(result && result.rows && result.rows.length < 1){
        result = {
          rows: [
            {
              id: -1
            }
          ]
        };
      }
      if(!err){

        //PICK RANDOM QUESTION
        var index = Math.floor(Math.random() * result.rows.length);
        var row = result.rows[index];

        //SET AS CURRENT QUESTION
        client.query('UPDATE status SET status=\''+row.id+'\' WHERE name=\'current_question_id\';',
          function (upErr, upResult) {
           if(upErr){
             body.ok = false;
             body.err = upErr;
             res.send(body);
             done();
           }else{

             //DISABLE QUESTION
             client.query('UPDATE questions SET enabled=FALSE WHERE id=\''+row.id+'\';',
               function(disErr, disResult){
                 if(disErr){
                   body.ok = false;
                   body.err = disErr;
                 }else{
                   if(disResult.rowCount < 1){
                     body.ok = false;
                     body.err = "Out of Questions. Reset to -1.";
                     body.humanErr = "Out of Questions!";
                   }else{
                     body.ok = true;
                     body.id = row.id;
                     body.question = row.question;
                     body.answers = {};
                     body.answers.A = row.a;
                     body.answers.B = row.b;
                     body.answers.C = row.c;
                     body.answers.D = row.d;
                     body.answers.correct = row.correct;
                   }
                 }
                 res.send(body);
                 done();
               }
             );
            }
          }
        );
      }else{
        body.ok = false;
        body.err = err;
        res.send(body);
        done();
      }
    });
  });
});

app.get('/current_question', function (req, res, next) {
  res.header("Content-Type", "application/json");
  var body = {};

  pg.connect(pgConInfo, function(err, client, done){
    client.query('SELECT * FROM status WHERE name = \'current_question_id\'', function(err, result) {
      if(!err){
        var newId = parseInt(result.rows[0].status);

        if(newId == -1){
          body.ok = false;
          body.err = "Out of Questions. ID is -1.";
          body.humanErr = "Out of Questions!";
          res.send(body);
          done();
        }else{

          client.query('SELECT * FROM questions WHERE id = \''+newId+'\'', function(err1, result1){
            if(result1  && result1.rows && result1.rows.length < 1){
              body.err = "No questions with that ID."
              body.ok = false;
            }else if(!err1){
              body.ok = true;
              body.id = newId;
              body.question = result1.rows[0].question;
              body.answers = {};
              body.answers.A = result1.rows[0].a;
              body.answers.B = result1.rows[0].b;
              body.answers.C = result1.rows[0].c;
              body.answers.D = result1.rows[0].d;
              body.answers.correct = result1.rows[0].correct;
            }else{
              body.ok = false;
              body.err = err1;
            }
            res.send(body);
            done();
          });

        }
      }else{
        body.ok = false;
        body.err = err;
        res.send(body);
        done();
      }
    });
  });
});

app.get("/admin/addquestion", function(req, res, next){
  res.header("Content-Type", "application/json");
  var body = {};

  if( req.query.password != app.get('adminpass') ){
    body.ok = false;
    body.err = "Bad admin password";
    res.send(body);
  }else{

    pg.connect(pgConInfo, function(err, client, done){
      client.query('insert into questions(question,a,b,c,d,correct) values (\''+req.query.question+'\', \''+req.query.a+'\', \''+req.query.b+'\', \''+req.query.c+'\', \''+req.query.d+'\', \''+req.query.correct+'\');', function(err, result) {
        if(!err){
          body.ok = true;
          res.send(body);
        }else{
          body.ok = false;
          body.err = err;
          res.send(body);
        }
        done();
      });
    });

  }
});

app.get("/admin/changecandystatus", function(req, res, next){
  res.header("Content-Type", "application/json");
  var body = {};

  if( req.query.password != app.get('adminpass') ){
    body.ok = false;
    body.err = "Bad admin password";
    res.send(body);
  }else{

    pg.connect(pgConInfo, function(err, client, done){
      client.query('update status set status=\''+req.query.status+'\' where name=\'candy\';', function(err, result) {
        if(!err){
          body.ok = true;
          res.send(body);
        }else{
          body.ok = false;
          body.err = err;
          res.send(body);
        }
        done();
      });
    });

  }
});

app.get("/admin/reenablequestions", function(req, res, next){
  res.header("Content-Type", "application/json");
  var body = {};

  if( req.query.password != app.get('adminpass') ){
    body.ok = false;
    body.err = "Bad admin password";
    res.send(body);
  }else{

    pg.connect(pgConInfo, function(err, client, done){
      client.query('update questions set enabled=TRUE;', function(err, result) {
        if(!err){
          body.ok = true;
          res.send(body);
        }else{
          body.ok = false;
          body.err = err;
          res.send(body);
        }
        done();
      });
    });

  }
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});