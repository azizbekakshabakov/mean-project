import * as React from "react";
import { useState, useEffect } from "react";
import MyAudioPlayer from "../component/AudioPlayer";
import axios from "axios";
import { redirect, Navigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Add = () => {
  const [name, setName] = useState();
  const [artist, setArtist] = useState();
  const [file, setFile] = useState();

  const [nameErr, setNameErr] = useState("");
  const [artistErr, setArtistErr] = useState("");
  const [fileErr, setFileErr] = useState("");

  // перенаправить если пользователь создан
  const [redirect, setRedirect] = useState(false);

  const handleName = (name) => {
    setName(name);
  };

  const handleArtist = (artist) => {
    setArtist(artist);
  };

  const handleFile = (file) => {
    setFile(file);
  };

  console.log(file);
  function isAudioFileByExtension(fileName) {
    const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".m4a"];
    const fileExtension = fileName.slice(
      ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
    );

    return audioExtensions.includes(`.${fileExtension.toLowerCase()}`);
  }

  const send = () => {
    let isErrored = false;

    if (name.length < 4 || name.length > 20) {
      setNameErr("Название слишком короткое или длинное");
      isErrored = true;
    } else setNameErr("");

    if (artist.length < 4 || artist.length > 20) {
      setArtistErr("Имя исполнителя меньше 4 символов или больше 20");
      isErrored = true;
    } else setArtistErr("");

    if (!isAudioFileByExtension(file["name"])) {
      setFileErr("Выбранный файл не аудио-файл");
      isErrored = true;
    } else setFileErr("");

    if (!isErrored) {
      axios
        .post(
          "http://localhost:5000/api/add",
          {
            name,
            artist,
            file,
          },
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Response:", response.data);
          setRedirect(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          setFileErr("Не удалось отправить файл");
        });
    }
  };

  if (redirect) return <Navigate replace to="/" />;
  if (!localStorage.getItem("token"))
    return <h1 style={{ textAlign: "center" }}>Доступ запрещен</h1>;
  return (
    <Container maxWidth="sm">
      <h1 style={{ textAlign: "center" }}>Добавить песню</h1>

      <Stack spacing={2}>
        <TextField
          id="ema"
          label="Название композиции"
          variant="outlined"
          onChange={(e) => handleName(e.target.value)}
        />
        {nameErr ? <Alert severity="error">{nameErr}</Alert> : ""}
        <TextField
          id="pass"
          label="Исполнитель"
          variant="outlined"
          onChange={(e) => handleArtist(e.target.value)}
        />
        {artistErr ? <Alert severity="error">{artistErr}</Alert> : ""}
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        marginTop={"25px"}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Выбрать файл
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </Button>
        {fileErr ? <Alert severity="error">{fileErr}</Alert> : ""}

        <Button
          variant="contained"
          color="success"
          onClick={send}
          sx={{ marginTop: "25px", textAlign: "center" }}
        >
          Создать
        </Button>
      </Stack>
    </Container>
  );
};

export default Add;
