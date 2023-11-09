import React from "react";

import styles from "../../styles/Right.module.scss";

const TrackListContainer = (props) => {
  return <div className={styles.trackList_container}>{props.children}</div>;
};

export default TrackListContainer;
