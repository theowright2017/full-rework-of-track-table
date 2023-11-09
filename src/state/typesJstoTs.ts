export type ColumnSaveContextType = {
  setRetrieve: (id: any, retrieveFunc: any) => void;
  getRetrievedDataForId: (trackColId: any) => any;
  idHasData: (trackColId: any) => boolean;
  retrieveAllData: () => any[];
}; // UPDATE TYPES HERE
