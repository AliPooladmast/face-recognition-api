const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();
const knex = require("knex");
const bcrypt = require("bcrypt");

const signin = require("./Controllers/SignIn");
const register = require("./Controllers/Register");
const profileId = require("./Controllers/ProfileId");
const image = require("./Controllers/Image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "admin5107",
    database: "face-recognition",
  },
});

app.use(bodyParser.json());
app.use(cors());

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profileId.handleProfileId(db));

app.put("/image", image.handleImage(db));

app.listen(port, () => {
  console.log(`this app is running on port ${port}`);
});
