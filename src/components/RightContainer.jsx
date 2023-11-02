import React, { createContext } from "react";

import styles from "../styles/Right.module.css";

/**
 *  - Specifically for extracting track change data on Save
 */
export const ColumnSaveContext = createContext();

/** Used in conjunction with ColumnSaveContext
 *  for extracting track change data
 */
function useTrackChanges() {
  const trackColIdToRetrieveMap = new Map();

  const setRetrieve = (id, retrieveFunc) => {
    trackColIdToRetrieveMap.set(id, retrieveFunc());
  };

  const getRetrievedDataForId = (trackColId) => {
    return trackColIdToRetrieveMap.get(trackColId);
  };

  const idHasData = (trackColId) => {
    return trackColIdToRetrieveMap.has(trackColId);
  };

  return {
    setRetrieve,
    getRetrievedDataForId,
    idHasData,
  };
}

const RightContainer = (props) => {
  const trackChanges = useTrackChanges();

  return (
    <ColumnSaveContext.Provider value={trackChanges}>
      <div className={styles.right_container}>{props.children}</div>
      {/* <button
        onClick={() => {
          console.log(
            "res:: ",
            trackChanges.getRetrievedDataForId("trackOne")()
          );
        }}
      >
        SAVE
      </button> */}
    </ColumnSaveContext.Provider>
  );
};

export default RightContainer;
