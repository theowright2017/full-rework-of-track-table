import React, { useRef, createContext } from "react";
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

import { useTrackChanges } from "../state/hooks/useTrackChanges";
import { useStudentsInTracksSet } from "../state/hooks/useTrackAllStudentsInExam";

import styles from "../styles/TrackView.module.css";

export const ColumnSaveContext = createContext(useTrackChanges());
export const StudentsInTracksContext = createContext();

const TrackSlotPageView = ({ allTracksinMap }) => {
  const allStudentsFromIndex = [...allTracksinMap.values()]
    .reduce((studentList, track) => {
      const studentsOfTrack = track.trackSlots.flatMap((slot) => slot.students);
      studentList.push([...studentsOfTrack]);
      return studentList;
    }, [])
    .flat();

  return (
    <StudentsInTracksContext.Provider
      value={useStudentsInTracksSet(allStudentsFromIndex)}
    >
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
                  allTracks={allTracksinMap}
                  selectedTrackIds={selectedTrackIds}
                  setSelectedTrackIds={setSelectedTrackIds}
                />
                <SaveDeleteDropArea />
              </TrackColumnContainer>

              <SelectedTracksContainer>
                {[...allTracksinMap.values()].map((track) => {
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

                  const displayTrack = selectedTrackIds.has(track.id)
                    ? ""
                    : "none";

                  return (
                    <div
                      className={styles.selected_track_column}
                      style={{
                        width: trackWidth(),
                        display: displayTrack,
                      }}
                    >
                      <SelectedTrackColumn
                        key={track.id}
                        selectedTrackCol={track}
                        multipleSelected={selectedTrackIds.size > 1}
                      />
                    </div>
                  );
                })}
              </SelectedTracksContainer>
            </>
          )}
        </RightContainer>
      </div>
    </StudentsInTracksContext.Provider>
  );
};

export default TrackSlotPageView;
