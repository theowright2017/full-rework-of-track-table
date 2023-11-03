import React, { useState } from "react";
import { ConnectDragSource } from "react-dnd";
import {
  SortingState,
  ColumnResizeMode,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  Table,
  flexRender,
  Row,
} from "@tanstack/react-table";

import studentListGenerator, {
  Student,
} from "../../pages/api/redundant/studentGenerator";
import mainColumnGenerator from "./ColumnGenerator";
import { TrackDragItemTypes } from "../../components/dragAndDrop/itemTypes";

import { IconSortAsc, IconSortDesc } from "../../vectors/TableIcons";
import { DraggableItem } from "../../components/dragAndDrop/DraggableItem";

import styles from "../../styles/Table.module.scss";

const SemTable = () => {
  const [data, setData] = useState(() => [...studentListGenerator]);
  const [columns] = React.useState<typeof mainColumnGenerator>(() => [
    ...mainColumnGenerator,
  ]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
  });

  return (
    <div
      className={styles.table_wrap}
      style={{ width: table.getCenterTotalSize() }}
      // suppressHydrationWarning={true}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const resizer = (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`${styles.resizer} ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                    style={{
                      transform:
                        columnResizeMode === "onEnd" &&
                        header.column.getIsResizing()
                          ? `translateX(${
                              table.getState().columnSizingInfo.deltaOffset
                            }px)`
                          : "",
                    }}
                  />
                );

                if (header.id === "length") {
                  return (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={styles.sticky_cell}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                }
                return (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={styles.header_cell}
                  >
                    <div className={styles.sorting_cell}>
                      <div
                        className={styles.sort}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {{
                          asc: <IconSortAsc />,
                          desc: <IconSortDesc />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </div>
                    {resizer}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <TableBody table={table} />;
      </table>
      <div className="h-4" />
    </div>
  );
};

interface TableProps {
  table: Table<Student>;
}

const TableBody = ({ table }: TableProps) => (
  <tbody>
    {table.getRowModel().rows.map((row, idx) => {
      return (
        <DraggableRow item={row} key={`${row.id}_${idx}`}>
          {(drag: ConnectDragSource) => (
            <tr
              key={row.id}
              ref={drag}
              className={idx % 2 !== 0 ? styles.alt_row : styles.normal_row}
            >
              {row.getVisibleCells().map((cell, idx) => (
                <td key={cell.id} className={!idx ? styles.sticky_cell : ""}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          )}
        </DraggableRow>
      );
    })}
  </tbody>
);

export default SemTable;

interface DRProps {
  children: (drag: ConnectDragSource) => JSX.Element;
  item: Row<Student>;
}

const DraggableRow = (props: DRProps) => {
  return (
    <DraggableItem item={props.item}>
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};
