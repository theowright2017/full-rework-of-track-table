import studentIndexGenerator from "./studentIndexGenerator";

const TRACK_LENGTH_MINS = 30;

export type Track = {
  PlannedSlotsPerTrack: number;
  PlannedStudentsPerTrackSlot: number;
  TrackSlotLengthMins: number;
  ////
  UsePlanSize: number;
  ////
  breakDurationMins: number;
  duration: number;
  iSlots: number;
  ////
  iStudentCount: number;
  iStudentSpecReqs: number;
  ////
  id: number;
  idAssessment: number;
  idData: number;
  name: string;
  ////
  planSize: number;
  ////
  studentIndex: any[][];
  ////
  systemAssessmentType: string;
};

const trackGenerator = () => {
  /*
        - create 4 tracks based off aoTrack object

    */

  const studentIndexes = studentIndexGenerator(TRACK_LENGTH_MINS);

  const tracks = ["13-1", "13-2", "25%", "50%"];

  return tracks.map((name, idx): Track => {
    const track: Track = {
      PlannedSlotsPerTrack: 30,
      PlannedStudentsPerTrackSlot: 3,
      TrackSlotLengthMins: TRACK_LENGTH_MINS,
      ///
      UsePlanSize: 0,
      ///
      breakDurationMins: 15,
      duration: 900,
      iSlots: 39,
      ///
      iStudentCount: 20,
      iStudentSpecReqs: 0,
      ///
      id: idx,
      idAssessment: 13,
      idData: idx,
      name: name,
      ///
      planSize: 100,

      studentIndex: studentIndexes,
      systemAssessmentType: "Serial",
    };
    return track;
  });
};

export default trackGenerator();
