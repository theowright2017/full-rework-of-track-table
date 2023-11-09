import React, {
  useState,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
} from "react";

import {
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  Table,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  ColumnVisibilityChooser,
  Filter,
  HeaderCell,
  HeaderValue,
  Resizer,
} from "./TableComponents";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import trackColumnGenerator from "../table/TrackColumnGenerator";

import styles from "../../styles/Table.module.scss";
import trackTableStyles from "../../styles/TrackTable.module.scss";

export const config = {
  numStickyCols: 2,
};

interface TableProps2 {
  data: StudentWithTrackSlot[];
  children: (table: Table<StudentWithTrackSlot>) => React.JSX.Element[];
  title: string;
  tableInfo: React.JSX.Element;
}

function SemTrackSlotTable(props: TableProps2) {
  const [data, setData] = useState(props.data);

  const [columns] = React.useState<typeof trackColumnGenerator>(() => [
    ...trackColumnGenerator,
  ]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] = React.useState({});

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode,
    state: {
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows: (row: StudentWithTrackSlot) => {
      if (row.students) {
        return row.students;
      }
      return [];
    },
  });

  return (
    <div className={trackTableStyles.table_container_tracks}>
      <div className={styles.title_container}>
        <h3>{props.title}</h3>
        <ColumnVisibilityChooser table={table} />
      </div>

      <div
        className={`${styles.table_wrap} ${styles.tracks}`}
        suppressHydrationWarning={true}
        style={{
          width: "400px",
          height: "300px",
        }}
      >
        <table
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.table_header_row}>
                {headerGroup.headers.map((header, headerIndex) => {
                  const notSticky = headerIndex + 1 > config.numStickyCols;
                  return (
                    <HeaderCell header={header}>
                      <div className={styles.inner}>
                        <HeaderValue header={header} />
                      </div>

                      {notSticky && (
                        <Resizer
                          table={table}
                          header={header}
                          columnResizeMode={columnResizeMode}
                          resizer={styles.resizer}
                        />
                      )}
                    </HeaderCell>
                  );
                })}
              </tr>
            ))}
          </thead>
          {props.children(table)}
        </table>
      </div>
      {props.tableInfo}
    </div>
  );
}

type TBodyProps = ComponentPropsWithoutRef<"tbody"> & {
  children: React.JSX.Element[] | React.JSX.Element;
};
const TableBody = ({ children, ...tableBodyProps }: TBodyProps) => (
  <tbody {...tableBodyProps}>{children}</tbody>
);

type RowRef = HTMLTableRowElement;
type TRowProps = ComponentPropsWithRef<"tr"> & {
  children: React.JSX.Element[] | React.JSX.Element;
};

const TableRow = forwardRef<RowRef, TRowProps>((props, ref) => (
  <tr ref={ref} {...props}>
    {props.children}
  </tr>
));

type CellRef = HTMLTableCellElement;
type TCellProps = ComponentPropsWithRef<"td"> & {
  children: JSX.Element | React.ReactNode;
};

const TableCell = forwardRef<CellRef, TCellProps>((props, cellRef) => (
  <td ref={cellRef} {...props}>
    {props.children}
  </td>
));

SemTrackSlotTable.Body = TableBody;
SemTrackSlotTable.Row = TableRow;
SemTrackSlotTable.Cell = TableCell;

export default SemTrackSlotTable;
