import React from "react";

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

export { IconSortAsc, IconSortDesc, IconSortNone };
