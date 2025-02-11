const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const pool = require("./database/");
const utilities = require("./utilities/"); // Ensure utilities are required
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');


// Routes
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute"); // Import error route
const accountRoute = require("./routes/accountRoute");

const app = express();

// ****************************
// View Engine Setup
// ****************************
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(express.static("public"));

// ****************************
// Middleware Setup
// ****************************

// Session Middleware
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: "sessionId",
}));

// Express Messages Middleware
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});



// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Cookie JWT middleware
app.use(cookieParser())

// JWT Cookies middleware
app.use(utilities.checkJWTToken)

// Middleware para revisar el JWT en cada petición y establecer loggedIn
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.locals.loggedIn = false;
      } else {
        res.locals.loggedIn = true;
        // Opcional: guarda los datos del usuario para usarlos en la vista
        res.locals.user = decoded;
      }
      next();
    });
  } else {
    res.locals.loggedIn = false;
    next();
  }
});



// ****************************
// Routes Setup
// ****************************

// Index route with error handling middleware
app.get("/", utilities.handleErrors(baseController.buildHome));

// Other routes
app.use("/inv", inventoryRoute);
app.use("/", errorRoute); // Use the error route
app.use("/account", accountRoute);

// ****************************
// 404 Not Found Middleware
// ****************************
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// ****************************
// Express Error Handler
// ****************************
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  let message = err.status === 404 ? err.message : "Oh no! There was a crash. Maybe try a different route?";
  
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// ****************************
// Server Setup
// ****************************
const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
