const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
var schedule = require("node-schedule");

//models
const Profile = require("./models/profile");

const app = express();
var morgan = require("morgan");

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 20;
rule.minute = 24;
//Schedule action
var j = schedule.scheduleJob(rule, async () => {
  console.log("Crons started");
  try {
    console.log("delete users");
    const deleteProfiles = await Profile.deleteMany({
      validationTokenExpiration: { $lt: new Date() },
    });
  } catch {
    console.log("error");
  }
});
//Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//Hide express
app.disable("x-powered-by");

//Helmet
app.use(helmet.xssFilter());
app.use(helmet.frameguard("deny"));
app.use(helmet.noSniff());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

app.use(morgan("tiny"));
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);

//Error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://AleksaOpacic:opacicaleksa32@cluster0-cplrq.mongodb.net/MTDSmartCard?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3003);
  })
  .catch((err) => console.log(err));
