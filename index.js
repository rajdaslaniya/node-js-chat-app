const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./src/route");

dotenv.config();

const connect = require("./src/connect");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

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
