const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./src/route");

dotenv.config();

const connect = require("./src/connect");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  // Allow requests from a specific origin
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace with your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }

  next();
});

app.use(router);

connect
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
