const express = require("express");
const { send } = require("express/lib/response");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

database = {
  users: [
    {
      id: 250,
      name: "Alex",
      email: "alex@gmail.com",
      password: "verymuch",
      enteries: 0,
      joined: new Date(),
    },
    {
      id: 251,
      name: "Brad",
      email: "brad@gmail.com",
      password: "awesome",
      enteries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("can not log in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.push({
    id: 252,
    name,
    email,
    password,
    enteries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id == id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id == id) {
      found = true;
      user.enteries++;
      return res.json(user.enteries);
    }
  });
  if (!found) {
    res.status(400).json("no such user");
  }
});

app.listen(port, () => {
  console.log(`this app is running on port ${port}`);
});
