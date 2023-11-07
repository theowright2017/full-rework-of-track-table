import React from "react";
import { useDrop } from "react-dnd";

export const DroppableItem = (props) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: props.type,
      canDrop: () => true, // check not in other cohorts, etc
      drop: (draggedItem, monitor) => {
        props.onDrop(draggedItem, props.copyOrMove);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [props.copyOrMove]
  );

  return props.children(drop, isOver, canDrop);
};
