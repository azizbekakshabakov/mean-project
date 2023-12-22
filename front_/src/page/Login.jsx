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

  // перенаправить если пользователь создан
  // const [redirect, setRedirect] = useState(false);

  const handleEmail = (email) => {
    setEmail(email);
  };

  const handlePassword = (password) => {
    setPassword(password);
  };

  const send = () => {
    axios
      .post("http://localhost:5000/api/login", {
        email,
        password,
      })
      .then((response) => {
        console.log("Response:", response.data);
        localStorage.setItem("token", response.data["token"]);
        // setRedirect(true);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
        setPasswordErr(error.response["data"]);
      });
  };

  // if (redirect) return <Navigate replace to="/" />;
  return (
    <Container maxWidth="sm">
      <h1 style={{ textAlign: "center" }}>Логин</h1>

      <Stack spacing={2}>
        <TextField
          id="ema"
          label="Почта"
          variant="outlined"
          onChange={(e) => handleEmail(e.target.value)}
        />
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
          Войти
        </Button>
      </Stack>
    </Container>
  );
};

export default Home;
