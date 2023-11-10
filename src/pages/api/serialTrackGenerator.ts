import studentListGenerator, { Student } from "./redundant/studentGenerator";
import mainColumnGenerator from "../../components/table/ColumnGenerator";
import trackGenerator, { Track } from "./redundant/trackGenerator";
import trackSlotGenerator, { StudentWithTrackSlot } from "./trackSlotGenerator";

// export type TrackSlotAndLength = {
//   trackSlot: StudentWithTrackSlot;
//   length: number;
// };

export type SerialTrack = {
  id: number; //track id
  idCohort: number; // track id
  idAssessment: number; // track.idAssessment
  name: string; // track.name
  selected: boolean; // figure this out somehow
  maxLength: number; // track.iSlots
  duration: number; // track.duration

  trackSlots: StudentWithTrackSlot[]; // replaces rows
};

/**
 *  This is formally where the rows are initialised in the codebase
 *
 *  currently takes:
 *  - id: track id => idCol
 *  - index: track index => ixCol
 *  - studentIndex: track.studentIndex
 *  - idAssessment: track.idAssessment
 *  - col.name
 *  - col.duration
 */
const serialTrackGenerator = (track: Track): SerialTrack => {
  // return a type SerialTrack that contains track slots derived from the track.studentIndex

  const trackslotsWithLength: StudentWithTrackSlot[] = track.studentIndex.map(
    (slotWithStudents, index) => {
      return trackSlotGenerator(
        slotWithStudents[0] ? slotWithStudents[0] : [],
        slotWithStudents[0] === null,
        studentListGenerator,
        index
        // index
      );
    }
  );

  return {
    id: track.id,
    idCohort: track.id,
    idAssessment: track.idAssessment,
    name: track.name,
    selected: track.name === "13-1",
    maxLength: track.iSlots,
    duration: track.duration,
    trackSlots: trackslotsWithLength,
    // columnsToShow: mainColumnGenerator,
    // columnsToShow: mainColumnGenerator
  };
};

export default serialTrackGenerator;
