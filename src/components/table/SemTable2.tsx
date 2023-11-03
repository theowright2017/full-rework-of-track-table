import React, { ReactNode, useState } from "react";
import { ConnectDragSource } from "react-dnd";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  getFilteredRowModel,
  getSortedRowModel,
  Table,
  Row,
  ColumnFiltersState,
  Header,
} from "@tanstack/react-table";

import { DraggableItem } from "../../components/dragAndDrop/DraggableItem";
import { TrackDragItemTypes } from "../../components/dragAndDrop/itemTypes";

import studentListGenerator, {
  Student,
} from "../../pages/api/redundant/studentGenerator";
import mainColumnGenerator from "../../components/table/ColumnGenerator";

import styles from "../../styles/Table.module.scss";
import {
  ColumnVisibilityChooser,
  Filter,
  HeaderValue,
  Resizer,
  SortingCell,
} from "./TableComponents";

function TableDragFrom() {
  const [data, setData] = useState(() => [...studentListGenerator]);

  const [columns] = React.useState<typeof mainColumnGenerator>(() => [
    ...mainColumnGenerator,
  ]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] = React.useState({});

  //   const [sorting, setSorting] = useState<SortingState>([]);

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode,
    state: {
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div id={"table-container"}>
      <ColumnVisibilityChooser table={table} />
      <div
        className={styles.table_wrap}
        style={{ width: table.getCenterTotalSize() }}
        suppressHydrationWarning={true}
      >
        <table
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <HeaderCell header={header}>
                      <div className={styles.inner}>
                        <SortingCell header={header} />
                        {/* <Filter column={header.column} /> */}
                        <HeaderValue header={header} />
                      </div>

                      <Resizer
                        table={table}
                        header={header}
                        columnResizeMode={columnResizeMode}
                        resizer={styles.resizer}
                      />
                    </HeaderCell>
                  );
                })}
              </tr>
            ))}
          </thead>
          <TableBody table={table} />;
        </table>
      </div>
    </div>
  );
}

interface TableProps {
  table: Table<Student>;
}

const TableBody = ({ table }: TableProps) => (
  <tbody>
    {table.getRowModel().rows.map((row, rowIndex) => {
      return (
        <DraggableRow item={row} key={`${row.id}_${rowIndex}`}>
          {(drag: ConnectDragSource) => (
            <tr key={row.id} ref={drag}>
              {row.getVisibleCells().map((cell, cellIndex) => {
                const normal =
                  rowIndex % 2 !== 0 ? styles.alt_cell : styles.normal_cell;
                const normalOrSorted = cell.column.getIsSorted()
                  ? styles.sorted_cell
                  : normal;
                return (
                  <td key={cell.id} className={normalOrSorted}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          )}
        </DraggableRow>
      );
    })}
  </tbody>
);

export default TableDragFrom;

interface DRProps {
  children: (drag: ConnectDragSource) => JSX.Element;
  item: Row<Student>;
}

const DraggableRow = (props: DRProps) => {
  return (
    <DraggableItem item={props.item} type={TrackDragItemTypes.ITEM}>
      {(drag: ConnectDragSource) => props.children(drag)}
    </DraggableItem>
  );
};

interface HCProps {
  header: Header<Student, unknown>;
  children: ReactNode;
}
const HeaderCell = (props: HCProps) => {
  const isSorted = props.header.column.getIsSorted();
  return (
    <th
      key={props.header.id}
      style={{ width: props.header.getSize() }}
      className={
        isSorted
          ? `${styles.header_cell} ${styles.sorted_cell}`
          : styles.header_cell
      }
    >
      {props.children}
    </th>
  );
};
