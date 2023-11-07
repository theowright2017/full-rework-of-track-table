import { Student } from "./redundant/studentGenerator";

export type StudentWithTrackSlot = {
  id?: number;
  trackSlotIndex?: number;
  totalTime?: string;
  lengthInput?: number;
  students?: StudentWithTrackSlot[];
  isBreakSlot?: boolean;

  code: string;
  name: string;
  course: string;
  campus: string;
};

// export type StudentWithTrackSlot = TrackSlot;

const trackSlotGenerator = (
  studentIds: Array<number | null>,
  isBreakSlot: boolean,
  listOfAllStudents: Student[],
  trackSlotId: number,
  trackSlotIndex: number
): StudentWithTrackSlot => {
  // const students = studentIds.map(
  //   (id) => listOfAllStudents.find((stu) => stu.id === id)
  // )

  let students: StudentWithTrackSlot[] = [];

  if (!isBreakSlot) {
    studentIds.forEach((id) => {
      const noStudent = {
        id: 0,
        name: "",
        course: "",
        code: "",
        campus: "",
        noStudent: true,
      };

      const match = listOfAllStudents.find((stu) => stu.id === id);
      // console.log("match", match);

      if (id === null) {
        // console.log("no student");
        students.push(noStudent);
      } else if (match !== undefined) {
        students.push(match);
      } else {
        // console.log("no match: ", id);
        students.push(noStudent);
      }
    });
  }

  return {
    id: trackSlotId,
    trackSlotIndex: trackSlotIndex,
    totalTime: "30 mins",
    lengthInput: 30,
    students: students,
    isBreakSlot: isBreakSlot,
    code: "",
    name: "",
    course: "",
    campus: "",
  };
};

export default trackSlotGenerator;
