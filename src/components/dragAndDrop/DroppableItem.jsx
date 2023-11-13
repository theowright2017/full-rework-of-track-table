import React from "react";
import { useDrop } from "react-dnd";

export const DroppableItem = (props) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: props.type,
      canDrop: () => true,
      drop: (draggedItem, monitor) => {
        props.onDrop(
          draggedItem.item,
          draggedItem.copyOrMove,
          draggedItem.multipleItems
        );

        return {
          draggedItem: draggedItem.item,
          copyOrMove: draggedItem.copyOrMove,
          dropSourceItem: props.dropSourceItem,
          multipleItems: draggedItem.multipleItems,
        };
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
