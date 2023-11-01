import { createColumnHelper } from "@tanstack/react-table";

import { Student } from "@/pages/api/studentGenerator";

const columnHelper = createColumnHelper<Student>();

const mainColumnGenerator = () => [
  columnHelper.accessor("code", {
    cell: (info) => info.getValue(),
    header: () => <div>Code</div>,
  }),
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <div>Name</div>,
  }),
  columnHelper.accessor("course", {
    id: "course",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <div>Course</div>,
  }),
  columnHelper.accessor("campus", {
    id: "campus",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <div>Campus</div>,
  }),
];

export default mainColumnGenerator();
