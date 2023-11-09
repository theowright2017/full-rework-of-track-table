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

import styles from "../../styles/Table.module.scss";
import trackStyles from "../../styles/TrackTable.module.scss";
import {
  WithJustSlots,
  WithSlotsAndPopover,
  WithSlotsAndStudents,
  WithSlotsStudentsAndPopover,
} from "../table/TrackTableComponents";

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

  const [selectedTrackSlot, setSelectedTrackSlot] = useState<
    number | undefined
  >(undefined);

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

  const tableInfoButtons = () => {
    function addSlot() {
      const newIndex = [...trackSlotsMap.values()].length;
      setTrackSlotSMap(
        (map) =>
          new Map(
            map.set(newIndex, {
              id: newIndex.toString(),
              trackSlotIndex: newIndex,
              length: 30,
              students: ["0", "1", "2"].map((studId) => ({
                // TW - TODO - make this config length of rows per slot
                id: `empty_row_${studId}`,
                code: "",
                name: "",
                course: "",
                campus: "",
              })),
              isBreakSlot: false,
              code: "",
              name: "",
              course: "",
              campus: "",
            })
          )
      );
    }
    function removeSlot() {
      console.log("remove");
      const lastSlot = trackSlotsMap.get(trackSlotsMap.size - 1);
      const hasStudents = lastSlot?.students?.some((row) => row.code !== "");

      if (hasStudents) {
        // show and wait for alert

        lastSlot?.students?.forEach((stu) => {
          if (stu.code !== "") {
            deleteStudentId(stu.id);
          }
        });
      }

      // TW - need to account for adding break slot, based on config
      setTrackSlotSMap((map) => {
        if (!lastSlot?.students?.length) {
          map.delete(trackSlotsMap.size - 1);
        }
        map.delete(trackSlotsMap.size - 1);

        const latestFinalSlot = trackSlotsMap.get(trackSlotsMap.size - 1);
        if (!latestFinalSlot?.students?.length) {
          map.delete(trackSlotsMap.size - 1);
        }

        return new Map(map);
      });
    }

    function addStudent() {
      if (selectedTrackSlot === undefined) {
        return;
      }

      const selectedSlot = trackSlotsMap.get(selectedTrackSlot);
      if (!selectedSlot) {
        return;
      }

      selectedSlot?.students?.push({
        id: selectedSlot?.students?.length.toString(),
        name: "",
        course: "",
        code: "",
        campus: "",
      });

      setTrackSlotSMap(
        (map) => new Map(map.set(selectedTrackSlot, selectedSlot))
      );
    }
    function removeStudent() {
      console.log("remove student");
      if (selectedTrackSlot === undefined) {
        return;
      }
      const selectedSlot = trackSlotsMap.get(selectedTrackSlot);
      if (!selectedSlot) {
        return;
      }
      if (selectedSlot.students?.length === 1) {
        return; // TW - need to grey -Slot button out ideally
      }

      if (
        selectedSlot.students?.[selectedSlot.students.length - 1].code !== ""
      ) {
        deleteStudentId(
          selectedSlot.students?.[selectedSlot.students.length - 1].id
        );
      }

      setTrackSlotSMap((map) => {
        selectedSlot.students?.pop();
        return new Map(map.set(selectedTrackSlot, selectedSlot));
      });
    }
    function unschedule() {
      // TW - need to hook up
    }

    const slotsAndStudentsProps = {
      addSlot,
      removeSlot,
      addStudent,
      removeStudent,
    };

    const slotsOnlyProps = {
      addSlot,
      removeSlot,
    };
    console.log("multiple", multipleSelected);
    switch (true) {
      case !multipleSelected && selectedTrackSlot !== undefined:
        return <WithSlotsAndStudents {...slotsAndStudentsProps} />;
      case !multipleSelected && selectedTrackSlot === undefined:
        return <WithJustSlots {...slotsOnlyProps} />;
      case multipleSelected && selectedTrackSlot !== undefined:
        return <WithSlotsStudentsAndPopover {...slotsAndStudentsProps} />;
      case multipleSelected && selectedTrackSlot === undefined:
        return <WithSlotsAndPopover {...slotsOnlyProps} />;
      // case isScheduled:
      //   return <UnscheduleTrack unschedule={unschedule}/>
    }

    return [<></>];
  };

  return (
    <SemTrackSlotTable
      key={Math.random()}
      data={[...trackSlotsMap.values()]}
      title={selectedTrackCol.name}
      tableInfo={<TableInfo>{tableInfoButtons()}</TableInfo>}
    >
      {(table: Table<StudentWithTrackSlot>) => {
        const trackSlotRows = table.getRowModel().rows;

        return trackSlotRows.map((trackSlotRow, trackSlotRowIdx) => {
          const totalLengthForThisSlot = trackSlotRows
            .slice(0, trackSlotRowIdx)
            .reduce((total, row) => total + row.original.length!, 0);

          const trackSlotIsSelected =
            selectedTrackSlot === trackSlotRowIdx &&
            trackSlotRow.original.isBreakSlot === false;

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
                        const numStickyCols = config.numStickyCols;

                        const selectslotFunc = () =>
                          setSelectedTrackSlot((prev: number | undefined) =>
                            prev === trackSlotRowIdx
                              ? undefined
                              : trackSlotRowIdx
                          );

                        let rowCellColour = "";
                        if (isOver && canDrop) {
                          rowCellColour = "green";
                        } else if (isOver && !canDrop) {
                          rowCellColour = "red";
                        } else if (trackSlotIsSelected && !isOver) {
                          rowCellColour = "lightblue";
                        } else if (trackSlotIsSelected && isOver && canDrop) {
                          rowCellColour = "green";
                        } else if (trackSlotIsSelected && isOver && !canDrop) {
                          rowCellColour = "red";
                        } else {
                          rowCellColour = "#fff";
                        }

                        let stickyCellColour = "";
                        if (trackSlotIsSelected) {
                          stickyCellColour = "lightblue";
                        } else {
                          stickyCellColour = "#fff";
                        }

                        return (
                          <SemTrackSlotTable.Row
                            key={subRow.id}
                            ref={(el) => {
                              drop(el), drag(el);
                            }}
                            className={trackStyles.slot_row}
                          >
                            {subRow.getVisibleCells().map((cell, cellIndex) => {
                              switch (true) {
                                case subRowIndex < 1 && cellIndex === 0:
                                  return (
                                    <SemTrackSlotTable.Cell
                                      rowSpan={trackSlotRow.subRows.length}
                                      className={trackStyles.sticky_cell}
                                      style={{
                                        left: "0",
                                        backgroundColor: stickyCellColour,
                                      }}
                                      onClick={() => selectslotFunc()}
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
                                      rowSpan={trackSlotRow.subRows.length}
                                      className={trackStyles.sticky_cell}
                                      style={{
                                        left: "50px",
                                        backgroundColor: stickyCellColour,
                                      }}
                                      onClick={() => selectslotFunc()}
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
                                      style={{
                                        backgroundColor: rowCellColour,
                                      }}
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
      onDrop={props.onDrop}
    >
      {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
        props.children(drop, isOver, canDrop)
      }
    </DroppableItem>
  );
};

export default SelectedTrackColumn;
