import { Student } from "./redundant/studentGenerator";

export type StudentWithTrackSlot = {
  id?: number;
  trackSlotIndex?: number;
  length?: number;
  students?: StudentWithTrackSlot[];
  isBreakSlot?: boolean;

  code: string;
  name: string;
  course: string;
  campus: string;
};

const trackSlotGenerator = (
  studentIds: Array<number | null>,
  isBreakSlot: boolean,
  listOfAllStudents: Student[],
  trackSlotId: number,
  trackSlotIndex: number
): StudentWithTrackSlot => {
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

      if (id === null) {
        students.push(noStudent);
      } else if (match !== undefined) {
        students.push(match);
      } else {
        students.push(noStudent);
      }
    });
  }

  return {
    id: trackSlotId,
    trackSlotIndex: trackSlotIndex,
    length: isBreakSlot ? 15 : 30,
    students: students,
    isBreakSlot: isBreakSlot,
    code: "",
    name: "",
    course: "",
    campus: "",
  };
};

export default trackSlotGenerator;
