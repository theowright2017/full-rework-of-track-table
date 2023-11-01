import studentListGenerator, { Student } from "./studentGenerator";
import mainColumnGenerator from "../../components/table/ColumnGenerator";
import trackGenerator, { Track } from "./trackGenerator";
import trackSlotGenerator, { TrackSlot } from "./trackSlotGenerator";

import { ColumnDef } from "@tanstack/react-table";
import ColumnGenerator from "../../components/table/ColumnGenerator";

export type SerialTrack = {
  //   trackIdx: number;
  //   id: string;
  //   length: number;
  //   slot: number;
  //   students: Student[];

  id: number; //track id
  // key: string;
  idCohort: number; // track id
  idAssessment: number; // track.idAssessment
  name: string; // track.name
  selected: boolean; // figure this out somehow
  maxLength: number; // track.iSlots
  duration: number; // track.duration
  //   rows: any[]; // taken from each student in the studentIndex
  trackSlots: TrackSlot[]; // replaces rows
  // columnsToShow: ColumnDef<Student, string>[]; // the actual main columns for the tables
  // panelType: string
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
  // return a track slot with rows

  const trackslots = track.studentIndex.map((slotWithStudents, index) => {
    return trackSlotGenerator(
      slotWithStudents[0],
      studentListGenerator,
      index,
      index
    );
  });

  return {
    id: track.id,
    idCohort: track.id,
    idAssessment: track.idAssessment,
    name: track.name,
    selected: track.name === "13-1",
    maxLength: track.iSlots,
    duration: track.duration,
    trackSlots: trackslots,
    // columnsToShow: mainColumnGenerator,
    // columnsToShow: mainColumnGenerator
  };
};

export default serialTrackGenerator;
