import React, { createContext, useContext, useEffect, useState } from "react";
import { Row, Table, flexRender } from "@tanstack/react-table";

import {
  ColumnSaveContext,
  StudentsInTracksContext,
} from "../../pages/TrackSlotPageView";
import { TableInfo } from "../table/TableComponents";

import {
  TrackLength,
  TrackInput,
  BreakSlot,
  DragAndDropRow,
} from "../table/TrackTableComponents";

import { SerialTrack } from "@/pages/api/serialTrackGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import SemTrackSlotTable, { config } from "../table/SemTrackSlotTable";
import { ConnectDragSource, ConnectDropTarget } from "react-dnd";
import { Student } from "@/pages/api/redundant/studentGenerator";

import { ColumnSaveContextType } from "@/state/typesJstoTs";

import trackStyles from "../../styles/TrackTable.module.scss";
import {
  WithJustSlots,
  WithSlotsAndPopover,
  WithSlotsAndStudents,
  WithSlotsStudentsAndPopover,
} from "../table/TableInfoButtonsForSelectedTrack";

type Props = {
  selectedTrackCol: SerialTrack;
  multipleSelected: boolean;
};

const SelectedTrackColumn = ({ selectedTrackCol, multipleSelected }: Props) => {
  // console.log("track", selectedTrackCol);

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

  const [selectedStudentsSet, setSelectedStudentsSet] = useState<Set<string>>(
    new Set("")
  );

  selectedColumnSaveContext?.setRetrieve(selectedTrackCol.id, () => {
    return trackSlotsMap;
  });

  useEffect(() => {
    setSelectedStudentsSet(() => new Set());
  }, [trackSlotsMap]);

  function onStudentSelection(
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    subRow: Row<StudentWithTrackSlot>
  ) {
    if (
      event.shiftKey &&
      selectedStudentsSet.size &&
      !selectedStudentsSet.has(subRow.id)
    ) {
      const rowsAreAllFromSameTrack =
        new Set(
          [...selectedStudentsSet.values(), subRow.id].map(
            (val) => val.split(".")[0]
          )
        ).size === 1;

      if (!rowsAreAllFromSameTrack) return;

      // get all in between row ids from last selected to current

      const lastSelected = [...selectedStudentsSet.values()].pop();
      if (!lastSelected) return;
      const lastSelectedTrackIdx = parseInt(lastSelected.split(".")[0]);
      const lastSelectedSubIdx = parseInt(lastSelected.split(".")[1]);
      const justShiftClickedTrackIdx = parseInt(subRow.id.split(".")[0]);
      const justShiftClickedSubIdx = parseInt(subRow.id.split(".")[1]);

      const newIdsToAddToSet: string[] = [];

      [...trackSlotsMap.values()].forEach((trackSlot, tsIdx) => {
        if (tsIdx < lastSelectedTrackIdx || tsIdx > justShiftClickedTrackIdx) {
          return;
        }
        if (!trackSlot.students?.length) return; // break

        let sliceStart = 0;
        let sliceEnd = 0;

        if (lastSelectedSubIdx > justShiftClickedSubIdx) {
          // shift up
          sliceStart = justShiftClickedSubIdx;
          sliceEnd = lastSelectedSubIdx;
        } else if (lastSelectedSubIdx < justShiftClickedSubIdx) {
          // shift down
          sliceStart = lastSelectedSubIdx;
          sliceEnd = justShiftClickedSubIdx;
        }

        trackSlot.students
          .slice(sliceStart, sliceEnd + 1)
          .forEach((_stu, stuIdx) => {
            newIdsToAddToSet.push(`${tsIdx}.${sliceStart + stuIdx}`);
          });
      });

      setSelectedStudentsSet((set) => new Set([...set, ...newIdsToAddToSet]));

      ///
    } else if (event.ctrlKey) {
      setSelectedStudentsSet((set) => {
        if (set.has(subRow.id)) {
          set.delete(subRow.id);
          return new Set(set);
        } else {
          return new Set(set.add(subRow.id));
        }
      });
    } else if (!event.ctrlKey && !event.shiftKey) {
      setSelectedStudentsSet(
        new Set(selectedStudentsSet.has(subRow.id) ? [] : [subRow.id])
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
      tableInfo={
        <TableInfo>
          {tableInfoButtons(
            trackSlotsMap,
            setTrackSlotSMap,
            // addStudentId,
            deleteStudentId,
            selectedTrackSlot,
            multipleSelected
          )}
        </TableInfo>
      }
    >
      {(table: Table<StudentWithTrackSlot>) => {
        const trackSlotRows = table.getRowModel().rows;

        return trackSlotRows.map((trackSlotRow, trackSlotRowIdx) => {
          const totalLengthForThisSlot = trackSlotRows
            .slice(0, trackSlotRowIdx)
            .reduce((total, row) => total + row.original.length!, 0);

          const trackSlotIsSelected = selectedTrackSlot === trackSlotRowIdx;

          return (
            <SemTrackSlotTable.Body key={`rowBody_${trackSlotRow.id}`}>
              {trackSlotRow.original.students?.length === 0 ? (
                <BreakSlot
                  key={`breakSlot_${trackSlotRow.id}`}
                  trackSlotRow={trackSlotRow}
                  length={totalLengthForThisSlot}
                  onChange={(value: number) => onChange(value, trackSlotRowIdx)}
                  multipleSelected={multipleSelected}
                />
              ) : (
                trackSlotRow.subRows?.map((subRow, subRowIndex) => {
                  const dragMultiple =
                    selectedStudentsSet.size > 1 &&
                    selectedStudentsSet.has(subRow.id);
                  // console.log("drag multple", dragMultiple);
                  return (
                    <DragAndDropRow
                      key={`dragDropRow_${subRow.id}`}
                      onDrop={{
                        trackSlotsMap,
                        setTrackSlotSMap,
                        subRowIndex,
                        trackSlotRowIdx,
                      }}
                      item={subRow}
                      dropAnchorItem={subRow}
                      dragItems={
                        dragMultiple
                          ? [...selectedStudentsSet.values()].map(
                              (trackAndSubId) => {
                                const slotRowIdx = parseInt(
                                  trackAndSubId.split(".")[0]
                                );
                                const subRowIdx = parseInt(
                                  trackAndSubId.split(".")[1]
                                );
                                // const slotRow = trackSlotsMap.get(slotRowIdx);
                                const slotRow = trackSlotRows[slotRowIdx];
                                const student = slotRow.subRows[subRowIdx];

                                return student;
                              }
                            )
                          : [subRow]
                      }
                      onDragMove={{
                        trackSlotsMap,
                        setTrackSlotSMap,
                        subRowIndex,
                        trackSlotRowIdx,
                      }}
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
                        } else if (selectedStudentsSet.has(subRow.id)) {
                          rowCellColour = "blue";
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
                            onClick={(event) =>
                              onStudentSelection(event, subRow)
                            }
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

export default SelectedTrackColumn;

// TW - change to separate component
function tableInfoButtons(
  trackSlotsMap: Map<number, StudentWithTrackSlot>,
  setTrackSlotSMap: React.Dispatch<
    React.SetStateAction<Map<number, StudentWithTrackSlot>>
  >,
  // addStudentId: (id: number) => void,
  deleteStudentId: (id: string | undefined) => void,
  selectedTrackSlot: number | undefined,
  multipleSelected: boolean
) {
  function addSlot() {
    const newIndex = [...trackSlotsMap.values()].length;
    setTrackSlotSMap(
      (map) =>
        new Map(
          map.set(newIndex, {
            id: newIndex.toString(),
            // trackSlotIndex: newIndex,
            // length: 30,
            students: ["0", "1", "2"].map((studId) => ({
              // TW - TODO - make this config length of rows per slot
              id: `empty_row_${studId}`,
              code: "",
              name: "",
              course: "",
              campus: "",
            })),
            // isBreakSlot: false,
            code: "",
            name: "",
            course: "",
            campus: "",
          })
        )
    );
  }
  function removeSlot() {
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

    if (selectedSlot.students?.[selectedSlot.students.length - 1].code !== "") {
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
}
