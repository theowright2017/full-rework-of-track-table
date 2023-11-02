import React, { useContext, useState } from "react";

import { ColumnSaveContext } from "../RightContainer";

const SelectedTrackColumn = ({ trackCol }) => {
  const selectedColumnSaveContext = useContext(ColumnSaveContext);

  const [trackSlots, setTrackSlots] = useState(["one"]);

  selectedColumnSaveContext.setRetrieve(trackCol.id, () => {
    return trackSlots;
  });

  return (
    <div>
      Selected Track Column
      <button onClick={() => setTrackSlots([...trackSlots, "two"])}>
        Button
      </button>
    </div>
  );
};

export default SelectedTrackColumn;
