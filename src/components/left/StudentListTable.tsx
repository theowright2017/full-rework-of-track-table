import React from "react";

import studentListGenerator, {
  Student,
} from "../../pages/api/redundant/studentGenerator";
import mainColumnGenerator from "../../components/table/ColumnGenerator";
import SemTable from "../table/SemTable2";
import { Row, Table, flexRender } from "@tanstack/react-table";
import { ConnectDragSource } from "react-dnd";

import styles from "../../styles/Table.module.scss";
import { DraggableItem } from "../dragAndDrop/DraggableItem";
import { TrackDragItemTypes } from "../dragAndDrop/itemTypes";
import { TableInfo } from "../table/TableComponents";

const StudentListTable = () => {
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
              return (
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
    <DraggableItem item={props.item} type={TrackDragItemTypes.ITEM}>
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

export default StudentListTable;
