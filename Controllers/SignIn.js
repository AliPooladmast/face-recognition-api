const handleSignIn = (db, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleSignIn: handleSignIn,
};
