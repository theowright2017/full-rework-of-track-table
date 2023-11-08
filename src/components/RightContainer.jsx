import React, { createContext, useState } from "react";

import styles from "../styles/Right.module.scss";

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
  const [selectedTrackIds, setSelectedTrackIds] = useState(new Set());

  return (
    <ColumnSaveContext.Provider>
      <div className={styles.right_container}>
        {props.children(selectedTrackIds, setSelectedTrackIds)}
      </div>
    </ColumnSaveContext.Provider>
  );
};

export default RightContainer;
