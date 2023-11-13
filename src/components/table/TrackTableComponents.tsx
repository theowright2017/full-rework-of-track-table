import { Student } from "@/pages/api/redundant/studentGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import React, { useContext } from "react";
import {
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
} from "react-dnd";
import { Row } from "@tanstack/react-table";
import { DraggableItem } from "../dragAndDrop/DraggableItem";
import { DroppableItem } from "../dragAndDrop/DroppableItem";
import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import SemTrackSlotTable from "./SemTrackSlotTable";

import styles from "../../styles/Table.module.scss";
import { StudentsInTracksContext } from "@/pages/TrackSlotPageView";

const TrackLength = ({ value }: { value: number | undefined }) => {
  return <div>{`${value ?? "--"} mins`}</div>;
};

const TrackInput = ({
  trackSlotRow,
  onChange,
}: {
  trackSlotRow: Row<StudentWithTrackSlot>;
  onChange: (value: number) => void;
}) => {
  return (
    <input
      type={"number"}
      style={{ width: "90%" }}
      value={trackSlotRow.original.length}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
};

const BreakSlot = ({
  trackSlotRow,
  length,
  onChange,
  multipleSelected,
}: {
  trackSlotRow: Row<StudentWithTrackSlot>;
  length: number;
  onChange: (value: number) => void;
  multipleSelected: boolean;
}) => (
  <SemTrackSlotTable.Row key={`breakRow_${trackSlotRow.id}`}>
    {trackSlotRow.getVisibleCells().map((breakCell, breakCellIdx) => {
      switch (true) {
        case breakCellIdx === 0:
          // length cell
          return (
            <SemTrackSlotTable.Cell
              key={`lengthCell_${breakCell.id}`}
              className={styles.sticky_cell}
              style={{ left: 0 }}
            >
              {`${length ?? "--"} mins`}
            </SemTrackSlotTable.Cell>
          );

        case breakCellIdx === 1 && !multipleSelected:
          // input cell
          return (
            <SemTrackSlotTable.Cell
              key={`inputCell_${breakCell.id}`}
              className={styles.sticky_cell}
              style={{ left: 50 }}
            >
              <input
                key={`input_${breakCell.id}`}
                type={"number"}
                style={{ width: "90%" }}
                value={trackSlotRow.original.length}
                onChange={(e) => onChange(Number(e.target.value))}
              />
            </SemTrackSlotTable.Cell>
          );
        default:
          return (
            <SemTrackSlotTable.Cell key={`breakCell_${breakCell.id}`}>
              <></>
            </SemTrackSlotTable.Cell>
          );
      }
    })}
  </SemTrackSlotTable.Row>
);

const DragAndDropRow = (props: {
  children: (
    drop: ConnectDropTarget,
    isOver: boolean,
    canDrop: boolean,
    drag: ConnectDragSource
  ) => React.JSX.Element;
  onDrop: {
    trackSlotsMap: Map<number, StudentWithTrackSlot>;
    setTrackSlotSMap: React.Dispatch<
      React.SetStateAction<Map<number, StudentWithTrackSlot>>
    >;
    subRowIndex: number;
    trackSlotRowIdx: number;
  };
  item: Row<StudentWithTrackSlot>;
  dropAnchorItem: Row<StudentWithTrackSlot>;
  dragItems: (Row<StudentWithTrackSlot> | undefined)[];
  // onDragMove: (item: Row<StudentWithTrackSlot>) => void;
  onDragMove: {
    trackSlotsMap: Map<number, StudentWithTrackSlot>;
    setTrackSlotSMap: React.Dispatch<
      React.SetStateAction<Map<number, StudentWithTrackSlot>>
    >;
    subRowIndex: number;
    trackSlotRowIdx: number;
  };
}) => (
  <DraggableRow
    item={props.item}
    dragItems={props.dragItems}
    onDragMove={props.onDragMove}
  >
    {(drag: ConnectDragSource) => (
      <DroppableRow onDrop={props.onDrop} dropAnchorItem={props.dropAnchorItem}>
        {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
          props.children(drop, isOver, canDrop, drag)
        }
      </DroppableRow>
    )}
  </DraggableRow>
);

const DraggableRow = (props: {
  item: Row<StudentWithTrackSlot>;
  // multipleItems: (Row<StudentWithTrackSlot> | undefined)[];
  dragItems: (Row<StudentWithTrackSlot> | undefined)[];
  // onDragMove: (item: Row<StudentWithTrackSlot>) => void;
  onDragMove: {
    trackSlotsMap: Map<number, StudentWithTrackSlot>;
    setTrackSlotSMap: React.Dispatch<
      React.SetStateAction<Map<number, StudentWithTrackSlot>>
    >;
    subRowIndex: number;
    trackSlotRowIdx: number;
  };
  children: (drag: ConnectDragSource) => React.JSX.Element;
}) => {
  //
  function onDragEnd(
    monitor: DropTargetMonitor<Row<StudentWithTrackSlot>, unknown>
  ) {
    if (monitor.didDrop()) {
      const dropResult: {
        draggedItem: Row<StudentWithTrackSlot>;
        copyOrMove: string;
        dropSourceItem: Row<StudentWithTrackSlot>;
      } | null = monitor.getDropResult();
      if (dropResult?.copyOrMove === "move") {
        // props.onDragMove(dropResult?.draggedItem);
        const {
          trackSlotsMap,
          setTrackSlotSMap,
          subRowIndex,
          trackSlotRowIdx,
        } = props.onDragMove;

        const existingSlot = trackSlotsMap.get(trackSlotRowIdx);

        if (existingSlot?.students) {
          existingSlot.students.splice(subRowIndex, 1, {
            id: `emptyRow_${subRowIndex}`,
            code: "",
            name: "",
            course: "",
            campus: "",
          });

          setTrackSlotSMap(
            (data) => new Map(data.set(trackSlotRowIdx, existingSlot))
          );
        }
      }
    }
  }

  return (
    <DraggableItem
      dragItems={props.dragItems}
      type={TrackDragItemTypes.ITEM}
      copyOrMove={"move"}
      onDragEnd={onDragEnd}
    >
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

const DroppableRow = (props: {
  dropAnchorItem: Row<StudentWithTrackSlot>;
  onDrop: {
    trackSlotsMap: Map<number, StudentWithTrackSlot>;
    setTrackSlotSMap: React.Dispatch<
      React.SetStateAction<Map<number, StudentWithTrackSlot>>
    >;
    subRowIndex: number;
    trackSlotRowIdx: number;
  };
  children: (
    drop: ConnectDropTarget,
    isOver: boolean,
    canDrop: boolean
  ) => React.JSX.Element;
}) => {
  const { deleteMultipleIds, addStudentId } = useContext(
    StudentsInTracksContext
  );

  function onDrop(
    draggedRow: Row<Student | StudentWithTrackSlot>,
    copyOrMove: string,
    multiRows: Row<Student | StudentWithTrackSlot>[]
  ) {
    const { trackSlotsMap, setTrackSlotSMap, subRowIndex, trackSlotRowIdx } =
      props.onDrop;

    const existingMap = new Map([...trackSlotsMap]);

    const slotToDropIn = existingMap.get(Number(props.dropAnchorItem.parentId));
    if (!slotToDropIn?.students) return;

    const subIdxToStartDropFrom = props.dropAnchorItem.index;

    const numRowsThatCanFit =
      slotToDropIn.students.length - subIdxToStartDropFrom;

    if (numRowsThatCanFit < multiRows.length) {
      // show alert
      // need to figure out how to filter excess out
    }

    const toRemove: string[] = [];

    multiRows.slice(0, numRowsThatCanFit).forEach((draggedRow, idx) => {
      // console.log("row", draggedRow);
      const { original: draggedItem } = draggedRow;

      const newStudentRowForTrackSlot: StudentWithTrackSlot = {
        id: draggedItem.code,
        code: draggedItem.code,
        name: draggedItem.name,
        course: draggedItem.course,
        campus: draggedItem.campus,
      };

      const emptyRow: StudentWithTrackSlot = {
        id: `emptyRow`,
        code: "",
        name: "",
        course: "",
        campus: "",
      };

      toRemove.push(
        slotToDropIn.students?.[subIdxToStartDropFrom + idx].id ?? ""
      );

      slotToDropIn.students?.splice(
        subIdxToStartDropFrom + idx,
        1,
        newStudentRowForTrackSlot
      );

      if (copyOrMove === "copy") {
        //from left
        addStudentId(draggedRow.id);
      } else if (copyOrMove === "move") {
        const slotTakenFrom = existingMap.get(parseInt(draggedRow.parentId!));

        if (!slotTakenFrom) return;

        slotTakenFrom.students?.splice(draggedRow.index, 1, emptyRow);

        existingMap.set(parseInt(draggedRow.parentId!), slotTakenFrom);
      }

      existingMap.set(trackSlotRowIdx, slotToDropIn);
    });

    // set main
    setTrackSlotSMap(() => new Map(existingMap));
    // set left
    deleteMultipleIds(toRemove);
  }

  return (
    <DroppableItem
      type={TrackDragItemTypes.ITEM}
      dropSourceItem={props.dropAnchorItem}
      onDrop={onDrop}
    >
      {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
        props.children(drop, isOver, canDrop)
      }
    </DroppableItem>
  );
};

export { TrackLength, TrackInput, BreakSlot, DragAndDropRow };
