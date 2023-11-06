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

interface TableProps2<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T, string>[];
  children: (table: Table<T>) => React.JSX.Element;
  title: string;
  filtering?: boolean;
  sorting?: boolean;
}

function SemTable<T extends Record<string, any>>(props: TableProps2<T>) {
  const [data, setData] = useState(() => [...props.data]);

  const [columns] = React.useState<typeof props.columns>(() => [
    ...props.columns,
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
      <div className={styles.title_container}>
        <h3>{props.title}</h3>
        <ColumnVisibilityChooser table={table} />
      </div>

      <div
        className={styles.table_wrap}
        // style={{ width: table.getCenterTotalSize() }}
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
                        {props.sorting && <SortingCell header={header} />}
                        {/* <Filter column={header.column} /> */}
                        {props.filtering ? (
                          <SemPopover
                            ariaLabel={"Filter on column"}
                            popoverTrigger={<HeaderValue header={header} />}
                            closeIcon={<CloseIconDark />}
                          >
                            <Filter header={header} />
                          </SemPopover>
                        ) : (
                          <HeaderValue header={header} />
                        )}
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
          {props.children(table)}
        </table>
      </div>
      <TableInfo />
    </div>
  );
}

type TBodyProps = ComponentPropsWithoutRef<"tbody"> & {
  children: React.JSX.Element[];
};
const TableBody = ({ children, ...tableBodyProps }: TBodyProps) => (
  <tbody {...tableBodyProps}>{children}</tbody>
);

type RowRef = HTMLTableRowElement;
type TRowProps = ComponentPropsWithRef<"tr"> & {
  children: React.JSX.Element[];
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

SemTable.Body = TableBody;
SemTable.Row = TableRow;
SemTable.Cell = TableCell;

export default SemTable;
