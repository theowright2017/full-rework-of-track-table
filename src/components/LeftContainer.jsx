import React from "react";

import styles from "../styles/Left.module.css";

const LeftContainer = (props) => {
  return <div className={styles.left_container}>{props.children}</div>;
};

export default LeftContainer;
