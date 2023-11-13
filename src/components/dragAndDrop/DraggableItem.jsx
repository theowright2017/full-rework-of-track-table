import { useDrag } from "react-dnd";

export const DraggableItem = (props) => {
  const [{ isDragging }, drag, preview] = useDrag(() => {
    return {
      item: {
        item: props.item,
        copyOrMove: props.copyOrMove,
        multipleItems: props.dragItems,
      },
      type: props.type,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (_draggedItem, monitor) => {
        if (props.copyOrMove === "move") {
          props.onDragEnd(monitor);
        } else if (props.copyOrMove === "copy") {
          props.onDragEnd(monitor);
        }
      },
    };
  });

  return props.children(drag);
};
