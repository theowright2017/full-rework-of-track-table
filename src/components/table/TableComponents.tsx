import {
  Column,
  ColumnResizeMode,
  Header,
  Table,
  flexRender,
} from "@tanstack/react-table";
import { Student } from "@/pages/api/redundant/studentGenerator";

import styles from "../../styles/Table.module.scss";
import { IconSortAsc, IconSortDesc, IconSortNone } from "@/vectors/TableIcons";
import React from "react";

const SortingCell = ({ header }: { header: Header<Student, unknown> }) => (
  <div className={styles.sorting_cell}>
    <div
      className={styles.sort}
      onClick={header.column.getToggleSortingHandler()}
    >
      {{
        asc: <IconSortAsc />,
        desc: <IconSortDesc />,
      }[header.column.getIsSorted() as string] ?? <IconSortNone />}
    </div>
  </div>
);

const Filter = ({ column }: { column: Column<Student, unknown> }) => {
  const [value, setValue] = React.useState("");

  return column.getCanFilter() ? (
    <div className={""}>
      <input
        value={value}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
          setValue(e.target.value);
        }}
      />
    </div>
  ) : (
    <React.Fragment />
  );
};

interface ResizeProps {
  table: Table<Student>;
  header: Header<Student, unknown>;
  columnResizeMode: ColumnResizeMode;
  resizer: string;
}
const Resizer = (props: ResizeProps) => (
  <div
    {...{
      onMouseDown: props.header.getResizeHandler(),
      onTouchStart: props.header.getResizeHandler(),
      className: `${styles.resizer} ${
        props.header.column.getIsResizing() ? styles.isResizing : ""
      }`,
      style: {
        transform:
          props.columnResizeMode === "onEnd" &&
          props.header.column.getIsResizing()
            ? `translateX(${
                props.table.getState().columnSizingInfo.deltaOffset
              }px)`
            : "",
      },
    }}
  />
);

const ColumnVisibilityChooser = ({ table }: { table: Table<Student> }) =>
  table.getAllLeafColumns().map((column) => {
    return (
      <div key={column.id} className="px-1">
        <label>
          <input
            {...{
              type: "checkbox",
              checked: column.getIsVisible(),
              onChange: column.getToggleVisibilityHandler(),
            }}
          />{" "}
          {column.id}
        </label>
      </div>
    );
  });

const HeaderValue = ({ header }: { header: Header<Student, unknown> }) => (
  <div className={styles.header_value}>
    {header.isPlaceholder
      ? null
      : flexRender(header.column.columnDef.header, header.getContext())}
  </div>
);

export { SortingCell, Filter, Resizer, ColumnVisibilityChooser, HeaderValue };
