import React, { useState } from "react";

import styles from "../../styles/Right.module.css";

const SelectedTracksContainer = (props) => {
  // const selectedTracks = [{ id: "trackOne" }];
  const [selectedTracks, setSelectedTracks] = useState(
    props.selectedTracks.filter((tr) => tr.selected)
  );

  console.log("selected", selectedTracks);
  return (
    <div className={styles.selectedTracks_container}>
      {props.children(selectedTracks)}
    </div>
  );
};

export default SelectedTracksContainer;
