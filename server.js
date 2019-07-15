require('dotenv').config();
var bodyParser = require("body-parser");
var session = require("express-session");
var express = require("express");
var handlebarsEngine = require('express-handlebars');
var passport = require("./config/passport");

var app = express();
var port = process.env.PORT || 9000;

var db = require("./models");

var app = express();
app.engine('handlebars', handlebarsEngine());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes/html-routes.js")(app);
require("./routes/parent-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);
require("./routes/teacher-api-routes.js")(app);
require("./routes/api-routes.js")(app);
db.sequelize.sync().then(function() {
  app.listen(port);
  console.log("App listening on PORT 9000");
});