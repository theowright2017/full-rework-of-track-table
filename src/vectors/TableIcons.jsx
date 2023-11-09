import React from "react";
import PropTypes from "prop-types";

const IconSortAsc = () => (
  <div
    style={{
      marginTop: 2,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="13px"
      height="8px"
      viewBox="0 0 13 8"
    >
      <path
        fill="#b0b0b0"
        d="M0.5,2.7l4.8,4.8C5.6,7.9,6.1,8,6.5,8c0.4,0,0.9-0.1,1.2-0.5l4.8-4.8c0.6-0.6,0.6-1.6,0-2.2s-1.6-0.6-2.2,0
	L6.5,4.3L2.7,0.5c-0.6-0.6-1.6-0.6-2.2,0S-0.2,2.1,0.5,2.7z"
      />
    </svg>
  </div>
);

const IconSortDesc = () => (
  <div
    style={{
      marginTop: 2,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="13px"
      height="8px"
      viewBox="0 0 13 8"
    >
      <path
        fill="#b0b0b0"
        d="M12.5,5.3L7.7,0.5C7.4,0.1,6.9,0,6.5,0C6.1,0,5.6,0.1,5.3,0.5L0.5,5.3c-0.6,0.6-0.6,1.6,0,2.2s1.6,0.6,2.2,0
						l3.8-3.8l3.8,3.8c0.6,0.6,1.6,0.6,2.2,0S13.1,5.9,12.5,5.3z"
      />
    </svg>
  </div>
);

const IconSortNone = () => (
  <div
    style={
      {
        // marginTop: 5,
      }
    }
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="13px"
      height="3px"
      viewBox="0 0 13 3"
    >
      <path
        fill="#b0b0b0"
        d="M11.5,3h-10C0.7,3,0,2.3,0,1.5v0C0,0.7,0.7,0,1.5,0l10,0C12.3,0,13,0.7,13,1.5v0C13,2.3,12.3,3,11.5,3z"
      />
    </svg>
  </div>
);

const ColumnVisibilityIcon = ({ sFill }) => (
  <svg
    className="colChooser"
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="22"
    viewBox="0 0 13 19"
  >
    <rect
      shapeRendering="crispEdges"
      fill={sFill}
      y="6"
      width="3"
      height="15"
    />
    <rect shapeRendering="crispEdges" fill={sFill} width="3" height="4" />
    <rect
      shapeRendering="crispEdges"
      fill={sFill}
      x="5"
      y="6"
      width="3"
      height="15"
    />
    <rect shapeRendering="crispEdges" fill={sFill} x="5" width="3" height="4" />
    <rect
      shapeRendering="crispEdges"
      fill={sFill}
      x="10"
      y="6"
      width="3"
      height="15"
    />
    <rect
      shapeRendering="crispEdges"
      fill={sFill}
      x="10"
      width="3"
      height="4"
    />
  </svg>
);

ColumnVisibilityIcon.propTypes = {
  sFill: PropTypes.string.isRequired,
};

const CloseIconWhite = () => (
  <svg
    // enable-background="new 0 0 100 100"
    id="Layer_1"
    version="1.1"
    // viewBox="0 0 100 100"
    // xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    // xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <polygon
      // fill="#FFF"
      points="77.6,21.1 49.6,49.2 21.5,21.1 19.6,23 47.6,51.1 19.6,79.2 21.5,81.1 49.6,53 77.6,81.1 79.6,79.2   51.5,51.1 79.6,23 "
    />
  </svg>
);

const CloseIconWhite2 = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#ffffff"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M16 8L8 16M8.00001 8L16 16"
        stroke="#ffffff"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const CloseIconDark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="10px"
    height="10px"
    viewBox="0 0 10 10"
  >
    <polygon
      fill="#808080"
      points="9.7,0 5,4.7 0.3,0 0,0.3 4.7,5 0,9.7 0.3,10 5,5.3 9.7,10 10,9.7 5.3,5 10,0.3 "
    />
  </svg>
);

const ButtonMoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="3px"
    height="13px"
    viewBox="0 0 3 13"
  >
    {/* <path fill="#848484" d="M2,4L2,4C0.9,4,0,3.1,0,2v0c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v0C4,3.1,3.1,4,2,4z"/>
					<path fill="#848484" d="M2,10L2,10c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v0C4,9.1,3.1,10,2,10z"/>
					<path fill="#848484" d="M2,16L2,16c-1.1,0-2-0.9-2-2v0c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2v0C4,15.1,3.1,16,2,16z"/> */}
    <circle fill="#848484" cx="1.5" cy="1.5" r="1.5" />
    <circle fill="#848484" cx="1.5" cy="6.5" r="1.5" />
    <circle fill="#848484" cx="1.5" cy="11.5" r="1.5" />
  </svg>
);

export {
  IconSortAsc,
  IconSortDesc,
  IconSortNone,
  ColumnVisibilityIcon,
  CloseIconWhite,
  CloseIconDark,
  CloseIconWhite2,
  ButtonMoreIcon,
};
