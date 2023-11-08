import React from "react";

import styles from "../../styles/Right.module.scss";

const SelectedTracksContainer = (props) => {
  return (
    <div className={styles.selected_tracks_container}>{props.children}</div>
  );
};

export default SelectedTracksContainer;
