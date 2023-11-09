export function useTrackChanges() {
  const trackColIdToRetrieveMap = new Map();

  const setRetrieve = (id, retrieveFunc) => {
    trackColIdToRetrieveMap.set(id, retrieveFunc);
  };

  const getRetrievedDataForId = (trackColId) => {
    return trackColIdToRetrieveMap.get(trackColId);
  };

  const idHasData = (trackColId) => {
    return trackColIdToRetrieveMap.has(trackColId);
  };

  return {
    setRetrieve,
    getRetrievedDataForId,
    idHasData,
  };
}
