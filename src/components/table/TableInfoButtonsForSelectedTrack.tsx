import React from "react";

import styles from "../../styles/TrackTable.module.scss";
import SemPopover from "../other/SemPopover";
import { ButtonMoreIcon, CloseIconDark } from "@/vectors/TableIcons";

const Button = (props: { buttonName: JSX.Element; onClick: () => void }) => (
  <button className={styles.info_button} onClick={props.onClick}>
    {props.buttonName}
  </button>
);

const AddSlot = ({ addSlot }: { addSlot: () => void }) => {
  return <Button buttonName={<p>{"+ Slot"}</p>} onClick={addSlot} />;
};

const AddSlotWithMoreIcon = () => {
  return (
    <p>
      {"+ Slot"}
      <ButtonMoreIcon />
    </p>
  );
};

const RemoveSlot = ({ removeSlot }: { removeSlot: () => void }) => {
  return <Button buttonName={<p>{"- Slot"}</p>} onClick={removeSlot} />;
};

const AddStudent = ({ addStudent }: { addStudent: () => void }) => {
  return <Button buttonName={<p>{"+ Student"}</p>} onClick={addStudent} />;
};

const RemoveStudent = ({ removeStudent }: { removeStudent: () => void }) => {
  return <Button buttonName={<p>{"- Student"}</p>} onClick={removeStudent} />;
};

const UnscheduleTrack = ({ unschedule }: { unschedule: () => void }) => {
  return <Button buttonName={<p>{"Unschedule"}</p>} onClick={unschedule} />;
};

const PopoverButton = (props: {
  popoverTrigger: React.JSX.Element;
  children: React.JSX.Element[] | React.JSX.Element;
}) => {
  return (
    <SemPopover
      ariaLabel={"Track column options"}
      popoverTrigger={props.popoverTrigger}
      closeIcon={<CloseIconDark />}
    >
      {props.children}
    </SemPopover>
  );
};

const WithSlotsAndStudents = (props: {
  addSlot: () => void;
  removeSlot: () => void;
  addStudent: () => void;
  removeStudent: () => void;
}) => {
  return (
    <React.Fragment>
      <AddSlot addSlot={props.addSlot} />
      <RemoveSlot removeSlot={props.removeSlot} />
      <AddStudent addStudent={props.addStudent} />
      <RemoveStudent removeStudent={props.removeStudent} />
    </React.Fragment>
  );
};

const WithJustSlots = (props: {
  addSlot: () => void;
  removeSlot: () => void;
}) => {
  return (
    <React.Fragment>
      <AddSlot addSlot={props.addSlot} />
      <RemoveSlot removeSlot={props.removeSlot} />
    </React.Fragment>
  );
};

const WithSlotsStudentsAndPopover = (props: {
  addSlot: () => void;
  removeSlot: () => void;
  addStudent: () => void;
  removeStudent: () => void;
}) => {
  return (
    <PopoverButton popoverTrigger={<AddSlotWithMoreIcon />}>
      <div className={styles.popover_content}>
        <AddSlot addSlot={props.addSlot} />
        <RemoveSlot removeSlot={props.removeSlot} />
        <AddStudent addStudent={props.addStudent} />
        <RemoveStudent removeStudent={props.removeStudent} />
      </div>
    </PopoverButton>
  );
};

const WithSlotsAndPopover = (props: {
  addSlot: () => void;
  removeSlot: () => void;
}) => {
  return (
    <PopoverButton popoverTrigger={<AddSlotWithMoreIcon />}>
      <div className={styles.popover_content}>
        <AddSlot addSlot={props.addSlot} />
        <RemoveSlot removeSlot={props.removeSlot} />
      </div>
    </PopoverButton>
  );
};

export {
  WithSlotsAndStudents,
  WithJustSlots,
  WithSlotsAndPopover,
  WithSlotsStudentsAndPopover,
  UnscheduleTrack,
};
