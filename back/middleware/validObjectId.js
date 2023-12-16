const mongoose = require("mongoose");

function validObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send({ message: "Неверный id" });

  next();
}

module.exports = { validObjectId };
