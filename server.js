const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

//Routes
const contactRoutes = require("./routes/contact");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const rateLimit = require("express-rate-limit");
var schedule = require("node-schedule");

//models
const Profile = require("./models/profile");

const app = express();
var morgan = require("morgan");
app.use(cors());
app.use(morgan("tiny"));
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
      validation: false,
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
//app.use(limiter);

//Hide express
app.disable("x-powered-by");

//Helmet
app.use(helmet.xssFilter());
app.use(helmet.frameguard("deny"));
app.use(helmet.noSniff());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/contact", contactRoutes);
app.use("/profile", profileRoutes);
app.use("/auth", authRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);

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
    app.listen(3001);
  })
  .catch((err) => console.log(err));
