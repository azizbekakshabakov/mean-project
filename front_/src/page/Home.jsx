import * as React from "react";
import { useState, useEffect } from "react";
import MyAudioPlayer from "../component/AudioPlayer";
import axios from "axios";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
// import Collapse from "@mui/material/Collapse";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import DraftsIcon from "@mui/icons-material/Drafts";
// import SendIcon from "@mui/icons-material/Send";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import StarBorder from "@mui/icons-material/StarBorder";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";

const Home = () => {
  const [source, setSource] = useState("");
  const [songs, setSongs] = useState();
  const [deleteErr, setDeleteErr] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/all")
      .then((response) => {
        console.log("Response:", response.data);
        setSongs(response.data["shuffledSongs"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  console.log(songs);

  const change = (songName) => {
    setSource("http://localhost:5000/api/stream/" + songName);
  };

  const deleteSong = (songId) => {
    if (localStorage.getItem("token")) {
      axios
        .delete(`http://localhost:5000/api/delete/${songId}`, {
          headers: { "x-auth-token": localStorage.getItem("token") },
        })
        .then((response) => {
          console.log("Response:", response.data);
          setDeleteErr("");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error:", error.response.data);
          setDeleteErr("Песня загружена другим пользователем");
        });
    } else setDeleteErr("Нет прав на удаление");
  };

  if (!songs)
    return <h1 style={{ textAlign: "center", marginTop: 200 }}>Загрузка...</h1>;
  return (
    <Container maxWidth="lg">
      <h1 style={{ textAlign: "center" }}>Песни</h1>

      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {/* Nested List It  ems */}
          </ListSubheader>
        }
      >
        {deleteErr ? <Alert severity="error">{deleteErr}</Alert> : ""}
        {songs.map((song, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteSong(song["_id"])}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => change(song["song"])}>
              <ListItemAvatar>
                <Avatar>
                  <MusicNoteIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={"Название: " + song["name"]}
                secondary={"Исполнитель: " + song["artist"]}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {/* {songs.map((song, index) => (
          <ListItemButton onClick={() => change(song["song"])} key={index}>
            <ListItemIcon>
              <MusicNoteIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Название: " + song["name"]}
              secondary={"Исполнитель: " + song["artist"]}
            />
          </ListItemButton>
        ))} */}
      </List>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <MyAudioPlayer
          // sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          // elevation={3}
          audioSource={source}
        />
      </Paper>
    </Container>
  );
};

export default Home;
