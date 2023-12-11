const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passComplex = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    "093uDFGh8raSouah",
    { expiresIn: "30d" }
  );
  return token;
};

const validate = (user) => {
  const schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: passComplex().required(),
    gender: joi.string().valid("male", "female").required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
