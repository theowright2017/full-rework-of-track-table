import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import { Split } from "@geoffcox/react-splitter";
// https://www.npmjs.com/package/@geoffcox/react-splitter

export const SemVerticalSplitter = (props) => {
  /*
        sizes state
            - primary - left width in px
            - secondary - right width in px
            - splitter - splitter size in px
        leftPercRef.current
            - left width in %
    */
  const [sizes, setSizes] = useState({});
  const leftPercRef = useRef(null);
  const onSplitChanged = (leftPercentageVal) => {
    leftPercRef.current = leftPercentageVal;
  };

  const onMeasuredSizesChanged = (sizes) => {
    setSizes(sizes);
  };

  const splitterWidth = 5;

  const Splitter = () => {
    return (
      <div
        style={{
          zIndex: "10000",
          border: "1px solid #BECDE9",
          position: "relative",
          height: "100%",
          width: 0,
        }}
      />
    );
  };

  return (
    <Split
      horizontal={false}
      initialPrimarySize={props.initialLeftPerc}
      minPrimarySize={props.minLeftPerc}
      minSecondarySize={props.minRightPerc}
      renderSplitter={() => <Splitter />}
      onSplitChanged={onSplitChanged}
      onMeasuredSizesChanged={_.debounce(onMeasuredSizesChanged, [300])}
      splitterSize={`${splitterWidth}px`}
    >
      {props.renderLeft(sizes, leftPercRef.current)}
      {props.renderRight(sizes.secondary + splitterWidth, leftPercRef.current)}
    </Split>
  );
};

SemVerticalSplitter.propTypes = {
  initialLeftPerc: PropTypes.string.isRequired,
  minLeftPerc: PropTypes.string.isRequired,
  minRightPerc: PropTypes.string.isRequired,
  renderLeft: PropTypes.func.isRequired,
  renderRight: PropTypes.func.isRequired,
};
