import React from "react";
// import dynamic from "next/dynamic";

// import { SemVerticalSplitter } from "../components/other/SemVerticalSplitter";
import LeftContainer from "../components/LeftContainer";
import RightContainer from "../components/RightContainer";
// import * as Right from '../components/right'
import StudentListContainer from "../components/left/StudentListContainer";
import StudentListTable from "../components/left/StudentListTable";
import TableInfoForStudentList from "../components/left/TableInfoForStudentList";

import SaveDeleteDropArea from "../components/right/SaveDeleteDropArea";
import TrackList from "../components/right/TrackList";
import TrackColumnContainer from "../components/right/TrackColumnContainer";
import SelectedTracksContainer from "../components/right/SelectedTracksContainer";
import SelectedTrackColumn from "../components/right/SelectedTrackColumn";

import styles from "../styles/TrackView.module.css";

// const Splitter = dynamic(
//   () => import("../components/other/SemVerticalSplitter"),
//   {
//     ssr: false,
//   }
// );

const TrackSlotPageView = ({ serialTracks }) => {
  // serial tracks contains trackSlots which contains Students

  /*
    LEFT
        <StudentListTable requires columns and students
        <TableInfoForStudentList requires selected col and row info from table

    RIGHT
        <TrackList requires serial tracks and selected info
        <SaveDeleteDropArea requires save process, and hook up to both tables for on delete

        <SelectedTracksContainer requires the track slots of a selected track
        <SelectedTrackColumn requires the table, duration header, table info


  */

  return (
    <div className={styles.main_container}>
      <LeftContainer>
        <StudentListContainer>
          <StudentListTable />
          {/* <TableInfoForStudentList /> */}
        </StudentListContainer>
      </LeftContainer>

      <RightContainer>
        {/* right container needs to deal with track selections */}
        <TrackColumnContainer>
          <TrackList />
          <SaveDeleteDropArea />
        </TrackColumnContainer>

        <SelectedTracksContainer selectedTracks={serialTracks}>
          {(selectedTracks) => {
            return selectedTracks.map((trackCol, idx) => (
              <SelectedTrackColumn key={idx} selectedTrackCol={trackCol} />
            ));
          }}
        </SelectedTracksContainer>
      </RightContainer>
    </div>
  );
};

export default TrackSlotPageView;
