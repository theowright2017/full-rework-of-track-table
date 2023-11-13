import React, { useContext, useEffect, useState } from "react";

import studentListGenerator, {
  Student,
} from "../../pages/api/redundant/studentGenerator";
import mainColumnGenerator from "../../components/table/ColumnGenerator";
import SemTable from "../table/SemTable2";
import { Row, Table, flexRender } from "@tanstack/react-table";
import { ConnectDragSource, DropTargetMonitor } from "react-dnd";

import styles from "../../styles/Table.module.scss";
import { DraggableItem } from "../dragAndDrop/DraggableItem";
import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import { TableInfo } from "../table/TableComponents";
import { StudentsInTracksContext } from "@/pages/TrackSlotPageView";

const StudentListTable = () => {
  const { studentsAssignedSet } = useContext(StudentsInTracksContext);
  const [selectedStudentsSet, setSelectedStudentsSet] = useState(new Set());

  useEffect(() => {
    setSelectedStudentsSet(new Set());
  }, [studentsAssignedSet]);

  function onStudentSelection(
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    selectedRow: Row<Student>,
    allRows: Row<Student>[]
  ) {
    if (event.ctrlKey) {
      setSelectedStudentsSet((set) => {
        if (set.has(selectedRow.id)) {
          set.delete(selectedRow.id);
          return new Set(set);
        } else {
          return new Set(set.add(selectedRow.id));
        }
      });
    } else if (event.shiftKey && !studentsAssignedSet.has(selectedRow.id)) {
      const prevSelectedRowId = [...selectedStudentsSet.values()].pop();

      const indexStart = allRows.findIndex(
        (row) => row.id === prevSelectedRowId
      );
      const indexEnd = allRows.findIndex((row) => row.id === selectedRow.id);
      let inBetween = allRows.slice(indexStart, indexEnd + 1);

      inBetween = inBetween.filter((row) => {
        return !studentsAssignedSet.has(row.original.id);
      });

      setSelectedStudentsSet(
        (set) => new Set([...set, ...inBetween.map((row) => row.id)])
      );
    } else if (event.shiftKey && studentsAssignedSet.has(selectedRow.id)) {
      return;
    } else if (!event.shiftKey && !event.ctrlKey) {
      setSelectedStudentsSet(
        new Set(selectedStudentsSet.has(selectedRow.id) ? [] : [selectedRow.id])
      );
    }
  }

  return (
    <SemTable<Student>
      data={[...studentListGenerator]}
      columns={[...mainColumnGenerator]}
      title={"Student List"}
      tableInfo={<TableInfo children={undefined} />}
      filtering={true}
      sorting={true}
    >
      {(table: Table<Student>) => {
        return (
          <SemTable.Body>
            {table.getRowModel().rows.map((row, rowIndex) => {
              return (
                <DraggableRow
                  item={row}
                  key={`${row.id}_${rowIndex}`}
                  dragItems={table
                    .getRowModel()
                    .rows.filter((row) => selectedStudentsSet.has(row.id))}
                >
                  {(drag: ConnectDragSource) => (
                    <SemTable.Row
                      key={row.id}
                      style={{
                        cursor: studentsAssignedSet.has(row.id)
                          ? "default"
                          : "pointer",
                      }}
                      ref={drag}
                      onClick={(event) =>
                        onStudentSelection(event, row, table.getRowModel().rows)
                      }
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const normal =
                          rowIndex % 2 !== 0
                            ? styles.alt_cell
                            : styles.normal_cell;
                        const normalOrSorted = cell.column.getIsSorted()
                          ? styles.sorted_cell
                          : normal;

                        const background = studentsAssignedSet.has(row.id)
                          ? "red"
                          : selectedStudentsSet.has(row.id)
                          ? "blue"
                          : "";

                        return (
                          <SemTable.Cell
                            key={cell.id}
                            className={normalOrSorted}
                            style={{
                              backgroundColor: background,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </SemTable.Cell>
                        );
                      })}
                    </SemTable.Row>
                  )}
                </DraggableRow>
              );
            })}
          </SemTable.Body>
        );
      }}
    </SemTable>
  );
};

type DRProps = {
  children: (drag: ConnectDragSource) => JSX.Element;
  item: Row<Student>;
  dragItems: Row<Student>[];
};

const DraggableRow = (props: DRProps) => {
  return (
    <DraggableItem
      key={Math.random()}
      dragItems={props.dragItems}
      type={TrackDragItemTypes.ITEM}
      onDragEnd={() => undefined}
      copyOrMove={"copy"}
    >
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

export default StudentListTable;
