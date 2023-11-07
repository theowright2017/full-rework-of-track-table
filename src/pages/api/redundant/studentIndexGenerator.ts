import studentListGenerator from "./studentGenerator";

// type StudentIndex = {
//   trackSlot: numbernull | Array<number>;
// };

const studentIndexGenerator = (trackSlotLengthMins: number) => {
  const students = studentListGenerator;

  const hard = [
    [0, 1, 2],
    null,
    [3, 4, 5],
    null,
    [6, 7, 8],
    null,
    [9, 10, 11],
    null,
    [12, 13, 14],
    null,
    [15, 16, 17],
    null,
    [18, 19, 20],
  ];

  const studentListArray = hard.map((studentIndexRow, index) => {
    return [studentIndexRow, index, trackSlotLengthMins];
  });

  return studentListArray;
};

export default studentIndexGenerator;
