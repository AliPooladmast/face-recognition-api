const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("it is working!");
});

app.post("/signin", signin.handleSignIn(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.post("/imageurl", image.handleImageUrl());

app.get("/profile/:id", profileId.handleProfileId(db));

app.put("/image", image.handleImage(db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`this app is running on port ${process.env.PORT}`);
});
