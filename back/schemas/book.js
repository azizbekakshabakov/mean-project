const mongoose = require("mongoose");
const joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: ObjectId, ref: "author", required: true },
  year: { type: Number, required: true },
});

const validate = (book) => {
  const schema = joi.object({
    name: joi.string().required(),
    author: joi.string().required(),
    year: joi.number().required(),
  });
  return schema.validate(book);
};

const Book = mongoose.model("book", bookSchema);

module.exports = { Book, validate };
