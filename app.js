// This is all 'plugin' required by this webapp
var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    Recette               = require("./models/recette"),
    Category              = require("./models/category"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    nodemailer            = require("nodemailer");



// setting up smtp to send mail.. (note: the %40 replace the @)
// If mail sending function don't work, verify your security account settings
var mailTransport = nodemailer.createTransport('smtps://USER%40gmail.com:PASSWORD@smtp.gmail.com');




//Connect to mongo database
mongoose.connect("mongodb://localhost/raptor");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected yeah!
  console.log("DATABASE -> Connected to mongodb");
});

// ---- express, template system (EJS), public folder Settings
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// ---- passport-local Configuration
app.use(require("express-session")({
  secret: "je possede un cousin qui collection des canard en plastique",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===========================================================================
//                           ! Routes !
// ===========================================================================

// ---- currentUser define
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// ---- index route
app.get("/", function(req, res){
	res.render("home",{currentUser: req.user});
});

app.get("/privacy", function(req, res){
  res.render("privacy");
});


// -------------------------------- **** Routes with authentication **** -----------------------------------

// ---- dashboard route
app.get("/user/dashboard", isLoggedIn, function(req, res){
  res.render("dashboard", { username: req.user.username });
});

// ---- register GET route
app.get("/register", function(req, res){
  res.render("register");
});
// ---- register POST route
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, birthdate: req.body.birthdate, email: req.body.email});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, function(){
      res.redirect("/user/dashboard");
    });
    // mail headers & content settings (FYI, we can use 'text:' instead of 'html')

var mailOptions = {
   from: "Node'Doc <nepasrepondre@nodedoc.com>",
   to: " " + newUser.firstname + " " + newUser.lastname +" <" + newUser.email +">",
   subject: "Welcome on Node'Doc :-)",
   html: '<h1>Bienvenue ' + newUser.firstname + ' ' + newUser.lastname + ' !</h1><p>Vous venez de votre inscrire à NodeDoc et nous vous en remercions.<br>Vous pouvez maintenant utiler le site avec votre login (<b>' + newUser.username + '</b>) et le mot de passe que vous avez renseigné lors de votre enregistrement. </p><br><br>Merci et à bientôt sur http://nodedoc.com<br><br>La Team NodeDoc'
};
  // User registration is complete, we send a mail to say Ola or Hello or Hi or ...
mailTransport.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
  });
});

//
//---------- Routes for recette ---------- //
//
//

// ---- recette
app.get("/recette", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
  console.log("olaaa");

});
app.get("/recette/new", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});

app.post("/recette", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });

  db.collection('Recette').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database!')
    res.redirect('/')
  })
});

app.get("/recette/:id", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});


// --- category
app.get("/category", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.get("/category/new", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.post("/category", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.get("/category/:id", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});

// --- objects
app.get("/object", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.get("/object/new", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.post("/object", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});
app.get("/object/:id", isLoggedIn, function(req, res){
  res.render("recette", { username: req.user.username });
});


// -------------------------------- Routes for members -------

// ---- login GET route
app.get("/login", function(req, res){
  res.render("login");
});

// ---- login POST route
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/user/dashboard",
    failureRedirect: "/login"
  }), function(req, res){
});

// ----- logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})


// ======================================================================================
//                           ! Middlewares !
// ======================================================================================

// ---- isLoggedIn control before accessing a member page, if the user is logged..
// ---- if not, we redirect him to the /login route
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}



// ==========================================================
//                           ! 404 !
// ==========================================================

// 404 route -> All crazy stuff finish here.. ¯\_(ツ)_/¯
app.get("*", function(req, res){
  res.render("404");
});


// ==================================================================
//                           **** SERVER CONFIGURATION ****
// ==================================================================

// server start here...
app.listen(3000, function(){
  console.log("SERVER STATUS -> STARTED!");
});
// Yes! That's all!
