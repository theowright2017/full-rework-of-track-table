import React, { useContext, useState } from "react";
import { Row, Table, flexRender } from "@tanstack/react-table";

import { ColumnSaveContext } from "../RightContainer";
import { TableInfo } from "../table/TableComponents";
import SemTable from "../table/SemTable2";

import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import { DraggableItem } from "../dragAndDrop/DraggableItem";
import { DroppableItem } from "../dragAndDrop/DroppableItem";

import styles from "../../styles/Table.module.scss";
import { SerialTrack } from "@/pages/api/serialTrackGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import SemTrackSlotTable, { config } from "../table/SemTrackSlotTable";
import { ConnectDragSource, ConnectDropTarget } from "react-dnd";
import { Student } from "@/pages/api/redundant/studentGenerator";

type Props = {
  selectedTrackCol: SerialTrack;
  multipleSelected: boolean;
};

const SelectedTrackColumn = ({ selectedTrackCol, multipleSelected }: Props) => {
  const selectedColumnSaveContext = useContext(ColumnSaveContext);

  const [trackSlotsMap, setTrackSlotSMap] = useState(
    new Map(
      selectedTrackCol.trackSlots.map((trackSlot, trackSlotIndex) => [
        trackSlotIndex,
        trackSlot,
      ])
    )
  );

  // selectedColumnSaveContext.setRetrieve(selectedTrackCol.id, () => {
  //   return trackSlots2;
  // });

  function onDrop(
    row: Row<Student>,
    copyOrMove: string,
    trackSlotRow: Row<StudentWithTrackSlot>,
    subRowIndex: number
  ) {
    const { original: item } = row;
    const { original: trackSlot } = trackSlotRow;

    const newStudentRowForTrackSlot: StudentWithTrackSlot = {
      id: subRowIndex,
      code: item.code,
      name: item.name,
      course: item.course,
      campus: item.campus,
    };

    const existingSlot = trackSlotsMap.get(trackSlot.trackSlotIndex!);

    if (existingSlot?.students) {
      existingSlot.students.splice(subRowIndex, 1, newStudentRowForTrackSlot);

      setTrackSlotSMap(
        (data) => new Map(data.set(trackSlot.trackSlotIndex!, existingSlot))
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
            <SemTrackSlotTable.Body>
              {trackSlotRow.original.isBreakSlot ? (
                <BreakSlot
                  trackSlotRow={trackSlotRow}
                  length={totalLengthForThisSlot}
                  onChange={(value: number) => onChange(value, trackSlotRowIdx)}
                  multipleSelected={multipleSelected}
                />
              ) : (
                trackSlotRow.subRows?.map((subRow, subRowIndex) => {
                  return (
                    <DragAndDropRow
                      copyOrMove={"copy"}
                      onDrop={(item, copyOrMove) =>
                        onDrop(item, copyOrMove, trackSlotRow, subRowIndex)
                      }
                    >
                      {(
                        drop: ConnectDropTarget,
                        isOver: boolean,
                        canDrop: boolean
                      ) => {
                        const dropHover = canDrop
                          ? styles.can_drop_hover
                          : styles.no_drop_hover;

                        const numStickyCols = config.numStickyCols;

                        return (
                          <SemTrackSlotTable.Row key={subRow.id} ref={drop}>
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
  <SemTrackSlotTable.Row>
    {trackSlotRow.getVisibleCells().map((breakCell, breakCellIdx) => {
      switch (true) {
        case breakCellIdx === 0:
          // length cell
          return (
            <SemTrackSlotTable.Cell
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
              className={styles.sticky_cell}
              style={{ left: 50 }}
            >
              <input
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
    canDrop: boolean
  ) => React.JSX.Element;
  copyOrMove: string;
  onDrop: (item: Row<Student>, copyOrMove: string) => void;
};
const DragAndDropRow = (props: DnDRowProps) => (
  // <DraggableRow item={props.item}>
  //   {(drag) => (
  <DroppableRow copyOrMove={props.copyOrMove} onDrop={props.onDrop}>
    {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
      props.children(drop, isOver, canDrop)
    }
  </DroppableRow>
  //   )}
  // </DraggableRow>
);

// const DraggableRow = (props) => {
//   return (
//     <DraggableItem item={props.item} type={TrackDragItemTypes.ITEM}>
//       {(drag) => props.children(drag)}
//     </DraggableItem>
//   );
// };

type DropRowProps = {
  copyOrMove: string;
  onDrop: (item: Row<Student>, copyOrMove: string) => void;
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
      copyOrMove={props.copyOrMove}
      onDrop={props.onDrop}
    >
      {(drop: ConnectDropTarget, isOver: boolean, canDrop: boolean) =>
        props.children(drop, isOver, canDrop)
      }
    </DroppableItem>
  );
};

export default SelectedTrackColumn;
