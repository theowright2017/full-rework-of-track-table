import * as Switch from "@radix-ui/react-switch";

import PropTypes from "prop-types";

import styles from "../../styles/SemSwitch.module.scss";

const SemSwitch = (props) => {
  return (
    <Switch.Root
      className={styles.switch_root}
      id={props.id}
      onCheckedChange={props.onChange}
      checked={props.checked}
    >
      <Switch.Thumb className={styles.switch_thumb} />
    </Switch.Root>
  );
};

export default SemSwitch;

SemSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};
