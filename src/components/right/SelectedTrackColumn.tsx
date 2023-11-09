import React, { ComponentPropsWithRef, useContext, useState } from "react";
import { Row, Table, flexRender } from "@tanstack/react-table";

import {
  ColumnSaveContext,
  StudentsInTracksContext,
} from "../../pages/TrackSlotPageView";
import { TableInfo } from "../table/TableComponents";
import SemTable from "../table/SemTable2";

import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import { DraggableItem } from "../dragAndDrop/DraggableItem";
import { DroppableItem } from "../dragAndDrop/DroppableItem";

import styles from "../../styles/Table.module.scss";
import { SerialTrack } from "@/pages/api/serialTrackGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import SemTrackSlotTable, { config } from "../table/SemTrackSlotTable";
import {
  ConnectDragSource,
  ConnectDropTarget,
  DropTargetMonitor,
} from "react-dnd";
import { Student } from "@/pages/api/redundant/studentGenerator";

import { ColumnSaveContextType } from "@/state/typesJstoTs";

type Props = {
  selectedTrackCol: SerialTrack;
  multipleSelected: boolean;
};

const SelectedTrackColumn = ({ selectedTrackCol, multipleSelected }: Props) => {
  const selectedColumnSaveContext =
    useContext<ColumnSaveContextType>(ColumnSaveContext);

  const { addStudentId, deleteStudentId } = useContext(StudentsInTracksContext);

  const [trackSlotsMap, setTrackSlotSMap] = useState(
    new Map(
      selectedTrackCol.trackSlots.map((trackSlot, trackSlotIndex) => [
        trackSlotIndex,
        trackSlot,
      ])
    )
  );

  selectedColumnSaveContext?.setRetrieve(selectedTrackCol.id, () => {
    return trackSlotsMap;
  });

  function onDrop(
    draggedRow: Row<Student | StudentWithTrackSlot>,
    copyOrMove: string,
    dropSourceRow: Row<StudentWithTrackSlot>,
    subRowIndex: number,
    trackSlotRowIndex: number
  ) {
    const { original: item } = draggedRow;
    const { original: studentWithTrackSlot } = dropSourceRow;
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

    const existingSlot = trackSlotsMap.get(trackSlotRowIndex);

    if (existingSlot?.students) {
      existingSlot.students.splice(subRowIndex, 1, newStudentRowForTrackSlot);

      setTrackSlotSMap(
        (data) => new Map(data.set(trackSlotRowIndex, existingSlot))
      );
    }
  }

  function onRowDraggedToDifferentTrack(
    draggedItem: Row<StudentWithTrackSlot>,
    trackSlotIndex: number,
    subRowIndex: number
  ) {
    const existingSlot = trackSlotsMap.get(trackSlotIndex);

    if (existingSlot?.students) {
      existingSlot.students.splice(subRowIndex, 1, {
        id: `emptyRow_${subRowIndex}`,
        code: "",
        name: "",
        course: "",
        campus: "",
      });

      setTrackSlotSMap(
        (data) => new Map(data.set(trackSlotIndex, existingSlot))
      );
    }
  }

  function onChange(value: number, trackSlotRowIdx: number) {
    let { ...existingSlot } = trackSlotsMap.get(trackSlotRowIdx);
    if (existingSlot) {
      existingSlot.length = value;
    }
    setTrackSlotSMap((map) => new Map(map.set(trackSlotRowIdx, existingSlot)));
  }

  return (
    <SemTrackSlotTable
      key={Math.random()}
      data={[...trackSlotsMap.values()]}
      title={selectedTrackCol.name}
      tableInfo={<TableInfo />}
    >
      {(table: Table<StudentWithTrackSlot>) => {
        const trackSlotRows = table.getRowModel().rows;

        return trackSlotRows.map((trackSlotRow, trackSlotRowIdx) => {
          const normal =
            trackSlotRowIdx % 2 !== 0 ? styles.alt_cell : styles.normal_cell;

          const totalLengthForThisSlot = trackSlotRows
            .slice(0, trackSlotRowIdx)
            .reduce((total, row) => total + row.original.length!, 0);

          return (
            <SemTrackSlotTable.Body key={`rowBody_${trackSlotRow.id}`}>
              {trackSlotRow.original.isBreakSlot ? (
                <BreakSlot
                  key={`breakSlot_${trackSlotRow.id}`}
                  trackSlotRow={trackSlotRow}
                  length={totalLengthForThisSlot}
                  onChange={(value: number) => onChange(value, trackSlotRowIdx)}
                  multipleSelected={multipleSelected}
                />
              ) : (
                trackSlotRow.subRows?.map((subRow, subRowIndex) => {
                  return (
                    <DragAndDropRow
                      key={`dragDropRow_${subRow.id}`}
                      onDrop={
                        (item, copyOrMove, dropSourceItem) =>
                          onDrop(
                            item,
                            copyOrMove,
                            dropSourceItem,
                            subRowIndex,
                            trackSlotRowIdx
                          ) // need to find drop source
                      }
                      item={subRow}
                      onDragMove={(item) =>
                        onRowDraggedToDifferentTrack(
                          item,
                          trackSlotRowIdx,
                          subRowIndex
                        )
                      }
                    >
                      {(
                        drop: ConnectDropTarget,
                        isOver: boolean,
                        canDrop: boolean,
                        drag: ConnectDragSource
                      ) => {
                        const dropHover = canDrop
                          ? styles.can_drop_hover
                          : styles.no_drop_hover;

                        const numStickyCols = config.numStickyCols;

                        return (
                          <SemTrackSlotTable.Row
                            key={subRow.id}
                            ref={(el) => {
                              drop(el), drag(el);
                            }}
                          >
                            {subRow.getVisibleCells().map((cell, cellIndex) => {
                              switch (true) {
                                case subRowIndex < 1 && cellIndex === 0:
                                  return (
                                    <SemTrackSlotTable.Cell
                                      rowSpan={3}
                                      className={styles.sticky_cell}
                                      style={{ left: "0" }}
                                    >
                                      <TrackLength
                                        value={totalLengthForThisSlot}
                                      />
                                    </SemTrackSlotTable.Cell>
                                  );
                                case subRowIndex === 0 &&
                                  cellIndex === 1 &&
                                  !multipleSelected:
                                  return (
                                    <SemTrackSlotTable.Cell
                                      rowSpan={3}
                                      className={styles.sticky_cell}
                                      style={{ left: "50px" }}
                                    >
                                      <TrackInput
                                        trackSlotRow={trackSlotRow}
                                        onChange={(value: number) =>
                                          onChange(value, trackSlotRowIdx)
                                        }
                                      />
                                    </SemTrackSlotTable.Cell>
                                  );
                                case cellIndex < numStickyCols:
                                  return <></>;
                                default:
                                  return (
                                    <SemTrackSlotTable.Cell
                                      key={cell.id}
                                      id={`cell-${cellIndex}_subR-${subRowIndex}`}
                                      className={isOver ? dropHover : normal}
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </SemTrackSlotTable.Cell>
                                  );
                              }
                            })}
                          </SemTrackSlotTable.Row>
                        );
                      }}
                    </DragAndDropRow>
                  );
                })
              )}
            </SemTrackSlotTable.Body>
          );
        });
      }}
    </SemTrackSlotTable>
  );
};

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
          return <></>;
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
  // copyOrMove: string;
  onDrop: (
    item: Row<Student | StudentWithTrackSlot>,
    copyOrMove: string,
    dropSourceItem: Row<StudentWithTrackSlot>
  ) => void;
  item: Row<StudentWithTrackSlot>;
  onDragMove: (item: Row<StudentWithTrackSlot>) => void;
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
  onDragMove: (item: Row<StudentWithTrackSlot>) => void;
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
        props.onDragMove(dropResult?.draggedItem);
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
  onDrop: (
    item: Row<Student | StudentWithTrackSlot>,
    copyOrMove: string,
    dropSourceItem: Row<StudentWithTrackSlot>
  ) => void;
  children: (
    drop: ConnectDropTarget,
    isOver: boolean,
    canDrop: boolean
  ) => React.JSX.Element;
};
const DroppableRow = (props: DropRowProps) => {
  return (
    <DroppableItem
      type={TrackDragItemTypes.ITEM}
      dropSourceItem={props.item}
      // copyOrMove={props.copyOrMove}
      onDrop={props.onDrop}
    >
      {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
        props.children(drop, isOver, canDrop)
      }
    </DroppableItem>
  );
};

export default SelectedTrackColumn;
