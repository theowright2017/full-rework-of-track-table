import React, { useContext } from "react";
import { DroppableItem } from "../dragAndDrop/DroppableItem";
import { DeleteBinIcon } from "../../vectors/TrackPageIcons";
import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import {
  ColumnSaveContext,
  StudentsInTracksContext,
} from "@/pages/TrackSlotPageView";

import styles from "../../styles/Right.module.scss";

const SaveDeleteDropArea = () => {
  return (
    <div className={styles.save_delete_area}>
      <SaveButton />
      <DropBinDelete />
    </div>
  );
};

export default SaveDeleteDropArea;

const SaveButton = () => {
  const { retrieveAllData } = useContext(ColumnSaveContext);

  return (
    <button
      className={styles.save}
      onClick={() => {
        console.log("all data", retrieveAllData());
      }}
    >
      Save
    </button>
  );
};

const DropBinDelete = () => {
  const { deleteStudentId } = useContext(StudentsInTracksContext);
  function onDrop(draggedRow, _copyOrMove, _dropSourceItem) {
    const { original: student } = draggedRow;

    deleteStudentId(student.id);
  }

  return (
    <DroppableItem
      type={TrackDragItemTypes.ITEM}
      dropSourceItem={undefined}
      onDrop={onDrop}
    >
      {(drop, isOver, canDrop) => {
        const fill = isOver && canDrop ? "red" : "#B1B0B0";

        return (
          <div ref={drop} className={styles.delete_bin}>
            <DeleteBinIcon fill={fill} />
          </div>
        );
      }}
    </DroppableItem>
  );
};
