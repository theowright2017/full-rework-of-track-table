import React, {
  useState,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
} from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  getFilteredRowModel,
  getSortedRowModel,
  Table,
  ColumnFiltersState,
  ColumnDef,
  Row,
} from "@tanstack/react-table";

import styles from "../../styles/Table.module.scss";
import {
  ColumnVisibilityChooser,
  Filter,
  HeaderCell,
  HeaderValue,
  Resizer,
  SortingCell,
  TableInfo,
} from "./TableComponents";
import SemPopover from "../other/SemPopover";
import { CloseIconDark } from "@/vectors/TableIcons";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";
import trackColumnGenerator from "../table/TrackColumnGenerator";

export const config = {
  numStickyCols: 2,
};

interface TableProps2 {
  data: StudentWithTrackSlot[];
  // columns: ColumnDef<StudentWithTrackSlot, string>[];
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

  console.log("table Data", data);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode,
    state: {
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows: (row: StudentWithTrackSlot) => {
      if (row.students) {
        console.log("students", row.students);
        return row.students;
      }
      return [];
    },
  });

  console.log("table", table.getRowModel());

  return (
    <div id={"table-container"}>
      <div className={styles.title_container}>
        <h3>{props.title}</h3>
        <ColumnVisibilityChooser table={table} />
      </div>

      <div
        className={styles.table_wrap}
        // style={{ width: table.getCenterTotalSize() }}
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
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, headerIndex) => {
                  const notSticky = headerIndex + 1 > config.numStickyCols;
                  return (
                    <HeaderCell
                      header={header}
                      // style={{ width: notSticky ? "10px" : "50px" }}
                    >
                      <div className={styles.inner}>
                        {/* <Filter column={header.column} /> */}

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
