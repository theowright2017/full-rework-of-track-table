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
import {
  ColumnSaveContext,
  StudentsInTracksContext,
} from "@/pages/TrackSlotPageView";
import { ColumnSaveContextType } from "@/state/typesJstoTs";
import { SerialTrack } from "@/pages/api/serialTrackGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";

const StudentListTable = () => {
  const { studentsAssignedSet } = useContext(StudentsInTracksContext);
  return (
    <SemTable<Student>
      data={[...studentListGenerator]}
      columns={[...mainColumnGenerator]}
      title={"Student List"}
      tableInfo={<TableInfo />}
      filtering={true}
      sorting={true}
    >
      {(table: Table<Student>) => {
        return (
          <SemTable.Body>
            {table.getRowModel().rows.map((row, rowIndex) => {
              return studentsAssignedSet.has(row.original.id) ? (
                <SemTable.Row key={row.id}>
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    const normalOrSorted = cell.column.getIsSorted()
                      ? styles.sorted_cell
                      : "";
                    return (
                      <SemTable.Cell
                        key={cell.id}
                        className={normalOrSorted}
                        style={{
                          backgroundColor: "red",
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
              ) : (
                <DraggableRow item={row} key={`${row.id}_${rowIndex}`}>
                  {(drag: ConnectDragSource) => (
                    <SemTable.Row key={row.id} ref={drag}>
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const normal =
                          rowIndex % 2 !== 0
                            ? styles.alt_cell
                            : styles.normal_cell;
                        const normalOrSorted = cell.column.getIsSorted()
                          ? styles.sorted_cell
                          : normal;
                        return (
                          <SemTable.Cell
                            key={cell.id}
                            className={normalOrSorted}
                            style={{
                              backgroundColor: studentsAssignedSet.has(
                                cell.row.original.id
                              )
                                ? "red"
                                : "",
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
};

const DraggableRow = (props: DRProps) => {
  return (
    <DraggableItem
      item={props.item}
      type={TrackDragItemTypes.ITEM}
      onDragEnd={() => undefined}
      copyOrMove={"copy"}
    >
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

export default StudentListTable;
