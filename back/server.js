var routes = require('./api/routes/hospitalRoutes');
require('./api/cron/HospitalsDetailsJob');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);
// app.use(job);
app.listen(port);

console.log('todo list RESTful API server started on: ' + port);
