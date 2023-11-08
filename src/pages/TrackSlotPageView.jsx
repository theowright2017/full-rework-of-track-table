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
  const allTracksinMap = new Map(
    serialTracks.map((track, index) => [track.id, track])
  );
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
        {(selectedTrackIds, setSelectedTrackIds) => (
          <>
            <TrackColumnContainer>
              <TrackList
                allTracks={serialTracks}
                selectedTrackIds={selectedTrackIds}
                setSelectedTrackIds={setSelectedTrackIds}
              />
              <SaveDeleteDropArea />
            </TrackColumnContainer>

            <SelectedTracksContainer>
              {[...selectedTrackIds].map((trackId, idx) => {
                const selectedTrack = allTracksinMap.get(trackId);

                const trackWidth = () => {
                  switch (selectedTrackIds.size) {
                    case 1:
                      return "100%";
                    case 2:
                      return "50%";
                    case 3:
                      return "33.3%";
                    case 4:
                      return "25%";
                    case 5:
                      return "20%";
                  }
                };
                return (
                  <div
                    className={styles.selected_track_column}
                    style={{ width: trackWidth() }}
                  >
                    <SelectedTrackColumn
                      key={idx}
                      selectedTrackCol={selectedTrack}
                      multipleSelected={selectedTrackIds.size > 1}
                    />
                  </div>
                );
              })}
            </SelectedTracksContainer>
          </>
        )}
        {/* right container needs to deal with track selections */}
      </RightContainer>
    </div>
  );
};

export default TrackSlotPageView;
