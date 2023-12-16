const express = require("express");
const router = express.Router();
const { User } = require("../schemas/user");
const { Author, validate } = require("../schemas/author");
const { auth } = require("../middleware/auth");
const { validObjectId } = require("../middleware/validObjectId");

//create author
router.post("/", auth, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const author = await Author(req.body).save();
  res.status(201).send({ data: author, message: "Author создана" });
});

//get authors
router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.status(200).send({ data: authors });
});

//get by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const author = await Author.findById(id);

  console.log(author);
  res.status(200).send({ data: author });
});

//get by name
router.get("/get-by-name/:name", async (req, res) => {
  const { name } = req.params;

  const author = await Author.find({ name: name });

  console.log(author);
  res.status(200).send({ data: author });
});

//get by year of birth
router.get("/get-by-birth-year/:year", async (req, res) => {
  const { year } = req.params;

  const author = await Author.find({ yearOfBirth: year });

  console.log(author);
  res.status(200).send({ data: author });
});

//update author
router.put("/:id", [validObjectId, auth], async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: author, message: "Обновлена author" });
});

//remove author
router.delete("/:id", [validObjectId, auth], async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Книга удалена" });
});

module.exports = router;
