const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute"); // Import error route
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/"); // Ensure utilities are required
const path = require("path");
const session = require("express-session");
const pool = require("./database/");
const bodyParser = require("body-parser")

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

app.use(express.static("public"));

/* ****************************
 * Middleware
 * ***************************/
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
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
/* ****************************
 * Routes
 * ***************************/
// Index route with error handling middleware
app.get("/", utilities.handleErrors(baseController.buildHome));

// Other routes
app.use("/inv", inventoryRoute);
app.use("/", errorRoute); // Use the error route
app.use("/account", accountRoute);

/* ****************************
 * 404 Not Found Middleware
 * ***************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ****************************
 * Express Error Handler
 * Place after all other middleware
 * ***************************/
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

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
