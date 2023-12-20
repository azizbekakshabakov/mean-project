import React from "react";
import AudioPlayer from "react-audio-player";

const MyAudioPlayer = ({ audioSource }) => {
  return (
    <AudioPlayer
      src={audioSource}
      autoPlay={true}
      controls
      loop={false}
      volume={0.5}
      className="custom-audio-player"
      style={{ width: "100%" }}
    />
  );
};

export default MyAudioPlayer;
