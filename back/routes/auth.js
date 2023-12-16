import express from "express";
const router = express.Router();
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/register", async (req, res) => {
  //   try {
  //Get the informaiton from the request body
  // const { email, password } = req.body;

  //if any of the fields are empty
  //   if (!fullName || !email || !password) {
  //     res.status(400);
  //     throw new Error("Please add all fields");
  //   }

  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const collection = db.collection("users");

  // Check if user exists
  const isBusy = await collection.findOne({ email: req.body.email });
  if (isBusy) {
    res.status(400).send("Логин зайнит");
    return;
    // throw new Error("");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);

  // Create user
  const user = await collection.insertOne({
    // name,
    email: req.body.email,
    password: newPassword,
    playlists: [],
  });
  if (user) {
    res.status(201).json({
      message: "Пользователь создан",
      status: "Успешно",
    });
  } else {
    res.status(400).send("Пользователь не создан");
    // throw new Error("Invalid user data");
  }
  //   } catch (err) {
  //     console.log(err.message);
  //     return res.send(err.message);
  //   }
});

router.post("/login", async (req, res) => {
  //   try {
  // const { email, password } = req.body;

  //if any of the fields are empty
  //   if (!email || !password) {
  //     res.status(400);
  //     throw new Error("Please add all fields");
  //   }

  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const collection = db.collection("users");

  // Check if user exists
  const user = await collection.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Пользователя нету в базе");
    return;
    // throw new Error("");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.status(200).json({
      message: "Пользователь залогинился",
      status: "Успшно",
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Неверные данные. Bad request");
    // throw new Error("Invalid credentials");
  }
  //   } catch (err) {
  //     res.send(err.message);
  //   }
});

//Generate JWT for the user
const generateToken = (id) => {
  return jwt.sign({ id }, "qwerty", {
    expiresIn: "7d",
  });
};

export default router;
