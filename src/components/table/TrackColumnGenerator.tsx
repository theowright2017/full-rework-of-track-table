import { createColumnHelper } from "@tanstack/react-table";

import { Student } from "@/pages/api/redundant/studentGenerator";
import { StudentWithTrackSlot } from "@/pages/api/trackSlotGenerator";

// type TrackSlot = {
//   trackSlotIndex: number;
//   lengthInput: number;
//   totalTime: string;
//   subRows: Student[];
// };

const columnHelper = createColumnHelper<StudentWithTrackSlot>();

const trackColumnGenerator = () => [
  columnHelper.accessor("totalTime", {
    id: "totalTime",
    cell: (info) => info.getValue(),
    header: () => <></>,
    maxSize: 50,
  }),
  columnHelper.accessor("lengthInput", {
    id: "lengthInput",
    cell: (info) => info.getValue(),
    header: () => <></>,
    maxSize: 50,
  }),
  columnHelper.accessor("code", {
    id: "code",
    cell: (info) => info.getValue(),
    header: () => <div>Code</div>,
  }),
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => info.getValue(),
    header: () => <div>Name</div>,
  }),
  columnHelper.accessor("course", {
    id: "course",
    cell: (info) => info.getValue(),
    header: () => <div>Course</div>,
  }),
  columnHelper.accessor("campus", {
    id: "campus",
    cell: (info) => info.getValue(),
    header: () => <div>Campus</div>,
  }),
];

export default trackColumnGenerator();
