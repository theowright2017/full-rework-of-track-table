import React from "react";

import styles from "../../styles/Right.module.css";

const SelectedTracksContainer = (props) => {
  const selectedTracks = [{ id: "trackOne" }];
  return (
    <div className={styles.selectedTracks_container}>
      {props.children(selectedTracks)}
    </div>
  );
};

export default SelectedTracksContainer;
