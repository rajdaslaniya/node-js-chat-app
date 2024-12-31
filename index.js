const { app, server } = require("./src/socket/socket");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = require("./src/route");
const cors = require("cors");

dotenv.config();

const connect = require("./src/connect");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(router);

connect
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
