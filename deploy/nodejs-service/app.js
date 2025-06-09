const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const datetime = require("node-datetime");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const dt = datetime.create();
const DEPLOYMENT_DATE = dt.format("m/d/Y H:M:S");
const NODE_MAJOR_VERSION = process.versions.node.split(".")[0];

console.log(dotenv);

const DEM_INFO = process.env.DEM_INFO || "Test NodeJS Service";
const HOSTED_ON = process.env.HOSTED_ON || "EC2 Machine";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use("/", indexRouter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", usersRouter);

app.get("/version-test", function (_req, res) {
  res.status(200).send({
    error: false,
    hosted_on: HOSTED_ON,
    deployment_date: DEPLOYMENT_DATE,
    message: DEM_INFO,
    node_version: NODE_MAJOR_VERSION,
  });
});

app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
