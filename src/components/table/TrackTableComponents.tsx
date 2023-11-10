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

type DnDRowProps = {
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
  // onDragMove: (item: Row<StudentWithTrackSlot>) => void;
  onDragMove: {
    trackSlotsMap: Map<number, StudentWithTrackSlot>;
    setTrackSlotSMap: React.Dispatch<
      React.SetStateAction<Map<number, StudentWithTrackSlot>>
    >;
    subRowIndex: number;
    trackSlotRowIdx: number;
  };
};
const DragAndDropRow = (props: DnDRowProps) => (
  <DraggableRow item={props.item} onDragMove={props.onDragMove}>
    {(drag: ConnectDragSource) => (
      <DroppableRow onDrop={props.onDrop} item={props.item}>
        {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
          props.children(drop, isOver, canDrop, drag)
        }
      </DroppableRow>
    )}
  </DraggableRow>
);

type DragRowProps = {
  item: Row<StudentWithTrackSlot>;
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
};
const DraggableRow = (props: DragRowProps) => {
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
      item={props.item}
      type={TrackDragItemTypes.ITEM}
      copyOrMove={"move"}
      onDragEnd={onDragEnd}
    >
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

type DropRowProps = {
  item: Row<StudentWithTrackSlot>;
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
};
const DroppableRow = (props: DropRowProps) => {
  const { addStudentId, deleteStudentId } = useContext(StudentsInTracksContext);

  function onDrop(
    draggedRow: Row<Student | StudentWithTrackSlot>,
    copyOrMove: string
  ) {
    const { trackSlotsMap, setTrackSlotSMap, subRowIndex, trackSlotRowIdx } =
      props.onDrop;
    const { original: item } = draggedRow;
    const { original: studentWithTrackSlot } = props.item;
    if (studentWithTrackSlot.code !== "") {
      deleteStudentId(studentWithTrackSlot.id);
    }
    addStudentId(item.id);

    const newStudentRowForTrackSlot: StudentWithTrackSlot = {
      id: item.code,
      code: item.code,
      name: item.name,
      course: item.course,
      campus: item.campus,
    };

    const existingSlot = trackSlotsMap.get(trackSlotRowIdx);

    if (existingSlot?.students) {
      existingSlot.students.splice(subRowIndex, 1, newStudentRowForTrackSlot);

      setTrackSlotSMap(
        (data) => new Map(data.set(trackSlotRowIdx, existingSlot))
      );
    }
  }

  return (
    <DroppableItem
      type={TrackDragItemTypes.ITEM}
      dropSourceItem={props.item}
      onDrop={onDrop}
    >
      {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
        props.children(drop, isOver, canDrop)
      }
    </DroppableItem>
  );
};

export { TrackLength, TrackInput, BreakSlot, DragAndDropRow };
