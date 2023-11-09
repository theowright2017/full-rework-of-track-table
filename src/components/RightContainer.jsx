import React, { createContext, useState } from "react";

import styles from "../styles/Right.module.scss";

/**
 *  - Specifically for extracting track change data on Save
 */

const RightContainer = (props) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState(new Set());

  return (
    <div className={styles.right_container}>
      {props.children(selectedTrackIds, setSelectedTrackIds)}
    </div>
  );
};

export default RightContainer;
