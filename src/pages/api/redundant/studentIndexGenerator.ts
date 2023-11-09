import studentListGenerator from "./studentGenerator";

// type StudentIndex = {
//   trackSlot: numbernull | Array<number>;
// };

const studentIndexGenerator = (
  trackSlotLengthMins: number,
  trackNum: number
) => {
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

  const hard2 = [
    [21, 22, 23],
    null,
    [24, 25, 26],
    null,
    [27, 28, 29],
    null,
    [30, 31, 32],
    null,
    [33, 34, 35],
    null,
    [36, 37, 38],
    null,
    [39, 40, 41],
  ];

  const hard3 = [
    [42, 43, 44],
    null,
    [45, null, null],
    null,
    [[48, null, null]],
  ];

  const hard4 = [
    [null, null, null],
    null,
    [null, null, null],
    null,
    [null, null, null],
  ];

  const studentsForTrack = () => {
    switch (trackNum) {
      case 1:
        return hard;
      case 2:
        return hard2;
      case 3:
        return hard3;
      case 4:
        return hard4;
      default:
        return [];
    }
  };

  const studentListArray = studentsForTrack().map((studentIndexRow, index) => {
    return [studentIndexRow, index, trackSlotLengthMins];
  });

  return studentListArray;
};

export default studentIndexGenerator;
