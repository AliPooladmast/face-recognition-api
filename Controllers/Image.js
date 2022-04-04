const Clarifai = require("clarifai");
const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

const handleImageUrl = () => (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.imageURL)
    .then((data) => res.json(data))
    .catch((err) => console.log("unable to work with api"));
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("enteries", 1)
    .returning("enteries")
    .then((enteries) => res.json(enteries[0].enteries))
    .catch((err) => res.status(400).json("Unable to get enteries"));
};

module.exports = {
  handleImage,
  handleImageUrl,
};
