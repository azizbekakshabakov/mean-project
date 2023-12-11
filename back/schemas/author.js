const mongoose = require("mongoose");
const joi = require("joi");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  yearOfBirth: { type: Number, required: true },
  hometown: { type: String, required: true },
});

const validate = (author) => {
  const schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    surname: joi.string().min(3).max(20).required(),
    yearOfBirth: joi.number().required(),
    hometown: joi.string().min(3).max(15).required(),
  });
  return schema.validate(author);
};

const Author = mongoose.model("author", authorSchema);

module.exports = { Author, validate };
