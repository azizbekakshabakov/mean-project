const express = require("express");
const router = express.Router();
const { User, validate } = require("../schemas/user");
const bcrypt = require("bcrypt");

/* register POST. */
router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(403).send({ message: "Логин занят" });

  const hashPassword = await bcrypt.hash(req.body.password, 3);
  let newUser = await new User({
    ...req.body,
    password: hashPassword,
  }).save();

  newUser.password = undefined;
  newUser.__v = undefined;

  res.status(200).send({ data: newUser, message: "Логин создан успешно" });
});

module.exports = router;
