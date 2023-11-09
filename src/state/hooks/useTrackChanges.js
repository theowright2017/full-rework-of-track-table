export function useTrackChanges() {
  const trackColIdToRetrieveMap = new Map();

  const setRetrieve = (id, retrieveFunc) => {
    trackColIdToRetrieveMap.set(id, retrieveFunc);
  };

  const getRetrievedDataForId = (trackColId) => {
    return trackColIdToRetrieveMap.get(trackColId)?.();
  };

  const idHasData = (trackColId) => {
    return trackColIdToRetrieveMap.has(trackColId);
  };

  const retrieveAllData = () => {
    return [...trackColIdToRetrieveMap.values()].map((retrieveFunc) =>
      retrieveFunc()
    );
  };

  return {
    setRetrieve,
    getRetrievedDataForId,
    idHasData,
    retrieveAllData,
  };
}
