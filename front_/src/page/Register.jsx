import * as React from "react";
import { useState, useEffect } from "react";
import MyAudioPlayer from "../component/AudioPlayer";
import axios from "axios";
import { redirect, Navigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordErr, setPasswordErr] = useState("");
  const [emailErr, setEmailErr] = useState("");

  // перенаправить если пользователь создан
  const [redirect, setRedirect] = useState(false);

  const handleEmail = (email) => {
    setEmail(email);
  };

  const handlePassword = (password) => {
    setPassword(password);
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    if (password.length < 4) return "Пароль слишком короткий";
    if (!/[A-Z]/.test(password))
      return "Пароль должен содержать заглавные буквы";
    if (!/[a-z]/.test(password))
      return "Пароль должен содержать строчные буквы";
    if (!/\d/.test(password)) return "Пароль должен содержать числа";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Пароль должен содержать символы !@#$%^&*(),.?";
  }

  const send = () => {
    let isErrored = false;

    if (!isValidEmail(email)) {
      setEmailErr("Почта не проходит валидацию");
      isErrored = true;
    } else setEmailErr("");

    const errorMessage = isValidPassword(password);
    if (errorMessage) {
      setPasswordErr(errorMessage);
      isErrored = true;
    } else setPasswordErr("");

    if (!isErrored)
      axios
        .post("http://localhost:5000/api/register", {
          email,
          password,
        })
        .then((response) => {
          console.log("Response:", response.data);
          setRedirect(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          setEmailErr("Логин занят");
        });
  };

  if (redirect) return <Navigate replace to="/login" />;
  return (
    <Container maxWidth="sm">
      <h1 style={{ textAlign: "center" }}>Регистрация</h1>

      <Stack spacing={2}>
        <TextField
          id="ema"
          label="Почта"
          variant="outlined"
          onChange={(e) => handleEmail(e.target.value)}
        />
        {emailErr ? <Alert severity="error">{emailErr}</Alert> : ""}
        <TextField
          id="pass"
          type="password"
          label="Пароль"
          variant="outlined"
          onChange={(e) => handlePassword(e.target.value)}
        />
        {passwordErr ? <Alert severity="error">{passwordErr}</Alert> : ""}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        marginTop={"25px"}
      >
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

export default Home;
