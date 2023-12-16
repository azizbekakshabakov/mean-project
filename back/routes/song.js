import express from "express";
import fs from "fs";
import multer from "multer";
import mongodb from "mongodb";
import { MongoClient } from "mongodb";
import { authMiddleware } from "../middleware/auth.js";
import { shuffleArray } from "../functions/suffle.js";

const upload = multer({ dest: "music/" });

const router = express.Router();

router.get("/stream/:file", async (req, res) => {
  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: "uploads",
  });

  // отправим музыку обратно
  const stream = bucket
    .openDownloadStreamByName(req.params.file)
    .pipe(res)
    .on("error", (error) => {
      console.log(error);
    });

  stream.on("end", () => {
    res.end();
  });
});

router.get("/all", async (req, res) => {
  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const collection = db.collection("songs");
  const songs = await collection.find({}).toArray();

  // перемешать массив
  const shuffledSongs = shuffleArray(songs);

  // if (songs.length === 0) {
  //   res.status(404);
  //   throw new Error("No songs found");
  // }
  res.status(200).json({ shuffledSongs });
});

router.post("/add", authMiddleware, upload.single("file"), async (req, res) => {
  console.log(req.file);
  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const collection = db.collection("songs");
  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: "uploads",
  });

  // загруз файл в базы
  const readStream = fs
    .createReadStream(req.file.path)
    .pipe(bucket.openUploadStream(req.file.filename));
  // console.log(req);

  // if there is an error throw an error
  readStream.on("error", (error) => {
    throw error;
  });

  // if the file is uploaded successfully delete the file from the uploads folder and insert the song data to the database
  readStream.on("finish", async () => {
    const song = await collection.insertOne({
      name: req.body.name,
      artist: req.body.artist,
      uploadedBy: req.userId,
      song: req.file.filename,
      file: readStream.id,
    });
    // console.log("asdfasdfasdf", song);
    if (song) {
      res.status(201).json({ message: "Песня добавлены", status: "Успешно" });
      fs.unlink("./music/" + readStream["filename"], (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else {
      res.status(400).send("Неверные данные");
    }
  });
});

router.delete("/delete/:id", authMiddleware, async (req, res) => {
  console.log(req.query.file);
  console.log(req.params);
  // console.log(req.query);
  // console.log(req.userId);

  const mongoClient = new MongoClient("mongodb://localhost:27017/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  const conn = await mongoClient.connect();
  const db = conn.db("projectdb");
  const collection = db.collection("songs");
  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: "uploads",
  });

  const song = await collection.findOne({
    _id: new mongodb.ObjectId(req.params.id),
  });
  // console.log("song", song);
  if (!song) {
    res.status(404).send("Песня не найдены");
    return;
    // throw new Error("Song not found");
  }
  if (song.uploadedBy !== req.userId) {
    res.status(401).send("Нет доступа к файлу");
    return;
    // throw new Error("Unauthorized");
  }
  const deleteSong = await collection.deleteOne({
    _id: new mongodb.ObjectId(req.params.id),
  });
  if (deleteSong) {
    await bucket.delete(song["file"]);
    res.status(200).json({ message: "Песни удалена", status: "Успешно" });
  } else {
    res.status(400).send("Невозможно удолить файл");
    return;
    // throw new Error("Error deleting song");
  }
  // } catch (error) {
  //   console.log(error);
  //   return res.json({ error: error.message, status: "error" });
  // }
});

export default router;
