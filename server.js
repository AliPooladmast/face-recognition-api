const express = require("express");
const { send } = require("express/lib/response");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();
const knex = require("knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      bcrypt.compare(req.body.password, data[0].hash, function (err, result) {
        if (result) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", req.body.email)
            .then((user) => res.json(user[0]))
            .catch((err) => res.status(400).json("Unable to get user"));
        } else res.status(400).json("Wrong password");
      });
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction((trx) => {
    trx
      .insert({
        email,
        hash,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(400).json("Not found");
    })
    .catch((err) => res.status(400).json("Error finding the user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("enteries", 1)
    .returning("enteries")
    .then((enteries) => res.json(enteries[0].enteries))
    .catch((err) => res.status(400).json("Unable to get enteries"));
});

app.listen(port, () => {
  console.log(`this app is running on port ${port}`);
});
