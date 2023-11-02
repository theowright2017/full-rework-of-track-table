import React from "react";

import styles from "../../styles/Left.module.css";

const StudentListContainer = (props) => {
  return <div className={styles.studentList_container}>{props.children}</div>;
};

export default StudentListContainer;
