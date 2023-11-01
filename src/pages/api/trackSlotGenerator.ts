import { Student } from "./studentGenerator";

export type TrackSlot = {
  id: number;
  trackSlotIndex: number;
  students: Array<Student | null>;
  isBreakSlot: boolean;
};

const trackSlotGenerator = (
  studentIds: number[],
  listOfAllStudents: Student[],
  trackSlotId: number,
  trackSlotIndex: number
): TrackSlot => {
  return {
    id: trackSlotId,
    trackSlotIndex: trackSlotIndex,
    students: studentIds?.map(
      (id) => listOfAllStudents.find((stu) => stu.id === id) ?? null
    ),
    isBreakSlot: studentIds === null,
  };
};

export default trackSlotGenerator;
