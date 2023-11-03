import React from "react";
import * as Popover from "@radix-ui/react-popover";

import PropTypes from "prop-types";

import styles from "../../styles/SemPopover.module.scss";

const SemPopover = (props) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.icon_button} aria-label={props.ariaLabel}>
          {props.popoverTrigger}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.popover_content} sideOffset={0}>
          {props.children}
          <Popover.Close className={styles.popover_close} aria-label={"Close"}>
            {props.closeIcon}
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SemPopover;

SemPopover.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  popoverTrigger: PropTypes.element.isRequired,
  closeIcon: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
