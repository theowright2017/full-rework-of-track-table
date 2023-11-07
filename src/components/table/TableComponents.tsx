import React, { ReactNode, useState, ComponentPropsWithoutRef } from "react";
import {
  Column,
  ColumnResizeMode,
  Header,
  Table,
  flexRender,
} from "@tanstack/react-table";
import { Student } from "@/pages/api/redundant/studentGenerator";

import {
  CloseIconWhite,
  CloseIconWhite2,
  ColumnVisibilityIcon,
  IconSortAsc,
  IconSortDesc,
  IconSortNone,
} from "@/vectors/TableIcons";
import SemPopover from "../../components/other/SemPopover";
import SemSwitch from "../../components/other/SemSwitch";

import styles from "../../styles/TableComponents.module.scss";

const SortingCell = <T,>({ header }: { header: Header<T, unknown> }) => (
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

const Filter = <T,>({ header }: { header: Header<T, unknown> }) => {
  const [value, setValue] = React.useState("");

  return (
    <div className={styles.filter}>
      <h5 className={styles.filter_name}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </h5>
      <div className={styles.input_container}>
        <input
          className={styles.filter_input}
          value={value}
          placeholder={"Filter..."}
          disabled={!header.column.getCanFilter()}
          onChange={(e) => {
            header.column.setFilterValue(e.target.value);
            setValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

interface ResizeProps<T> {
  table: Table<T>;
  header: Header<T, unknown>;
  columnResizeMode: ColumnResizeMode;
  resizer: string;
}
const Resizer = <T,>(props: ResizeProps<T>) => (
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

const ColumnVisibilityTrigger = () => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ColumnVisibilityIcon sFill={hover ? "#97B0DD" : "#B0B0B0"} />
    </div>
  );
};

const ColumnVisibilityChooser = <T,>({ table }: { table: Table<T> }) => (
  <div>
    <SemPopover
      ariaLabel={"Choose columns"}
      popoverTrigger={<ColumnVisibilityTrigger />}
      closeIcon={<CloseIconWhite2 />}
    >
      <div className={styles.column_vis_body}>
        <div className={styles.title_bar}>
          <p className={styles.title}>Select Columns</p>
        </div>
        {table.getAllLeafColumns().map((column) => {
          return (
            <fieldset key={column.id} className={styles.item}>
              <label className={styles.item_label} htmlFor={column.id}>
                {column.id}
              </label>
              <input
                className={styles.item_switch}
                type={"checkbox"}
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
            </fieldset>
          );
        })}
      </div>
    </SemPopover>
  </div>
);

type HCProps<T> = ComponentPropsWithoutRef<"th"> & {
  header: Header<T, unknown>;
  children: ReactNode;
};

const HeaderCell = <T,>(props: HCProps<T>) => {
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
      {...props}
    >
      {props.children}
    </th>
  );
};

const HeaderValue = <T,>({ header }: { header: Header<T, unknown> }) => (
  <div className={styles.header_value}>
    {header.isPlaceholder
      ? null
      : flexRender(header.column.columnDef.header, header.getContext())}
  </div>
);

interface TIProps {}
const TableInfo = (props: TIProps) => {
  return (
    <div className={styles.info_container}>
      <div className={styles.left_container}>
        <div className={styles.info}>
          <p>23</p>
          <p>of</p>
          <p>39</p>
          <p>Rows</p>
        </div>
        <div className={styles.info}>
          <p>5</p>
          <p>of</p>
          <p>5</p>
          <p>Cols</p>
        </div>
      </div>
      <div className={styles.right_container}></div>
    </div>
  );
};

export {
  SortingCell,
  Filter,
  Resizer,
  ColumnVisibilityChooser,
  HeaderValue,
  HeaderCell,
  TableInfo,
};
