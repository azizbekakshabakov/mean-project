const express = require("express");
const router = express.Router();
const { User } = require("../schemas/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Неверный имейл иил пароль" });

  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword)
    return res.status(400).send({ message: "Неверный имейл иил пароль" });

  const token = user.generateAuthToken();
  res.status(200).send({ data: token });
});

module.exports = router;
