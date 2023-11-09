import React from "react";

import styles from "../../styles/TrackComponents.module.scss";

const TrackList = ({ allTracks, selectedTrackIds, setSelectedTrackIds }) => {
  function selectTrack(track) {
    if (selectedTrackIds.has(track.id)) {
      setSelectedTrackIds((prev) => {
        selectedTrackIds.delete(track.id);
        return new Set(prev);
      });
    } else {
      setSelectedTrackIds((prev) => new Set([...prev, track.id]));
    }
  }

  return (
    <div>
      {[...allTracks.values()].map((track) => (
        <TrackListItem
          track={track}
          isSelected={selectedTrackIds.has(track.id)}
          selectTrack={selectTrack}
          noSelect={
            selectedTrackIds.size === 5 && !selectedTrackIds.has(track.id)
          }
        />
      ))}
    </div>
  );
};

export default TrackList;

const TrackListItem = ({ track, isSelected, selectTrack, noSelect }) => {
  const onSelectTrack = noSelect ? undefined : () => selectTrack(track);
  return (
    <div
      onClick={onSelectTrack}
      className={`${styles.track_list_item} ${
        isSelected ? styles.selected : ""
      } ${noSelect ? styles.no_select : ""}`}
    >
      <div className={styles.title}>{track.name}</div>
    </div>
  );
};
