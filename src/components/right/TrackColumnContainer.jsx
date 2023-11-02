import React from "react";

import styles from "../../styles/Right.module.css";

const TrackColumnContainer = (props) => {
  return <div className={styles.trackList_container}>{props.children}</div>;
};

export default TrackColumnContainer;
