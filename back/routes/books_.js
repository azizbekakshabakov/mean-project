const express = require("express");
const router = express.Router();
const { User } = require("../schemas/user");
const { Book, validate } = require("../schemas/book");
const { Author } = require("../schemas/author");
const { auth } = require("../middleware/auth");
const { validObjectId } = require("../middleware/validObjectId");

//create book
router.post("/", auth, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const book = await Book(req.body).save();
  res.status(201).send({ data: book, message: "Книга создана" });
});

//get books
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.status(200).send({ data: books });
});

//get by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  console.log(book);
  res.status(200).send({ data: book });
});

//get by author
router.get("/get-by-author/:authorName", async (req, res) => {
  const { authorName } = req.params;

  const author = await Author.find({ name: authorName });
  console.log(author[0]._id);
  const book = await Book.find({ author: author[0]._id });

  console.log(book);
  res.status(200).send({ data: book });
});

//update book
router.put("/:id", [validObjectId, auth], async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: book, message: "Обновлена книга" });
});

//remove book
router.delete("/:id", [validObjectId, auth], async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Книга удалена" });
});

module.exports = router;
