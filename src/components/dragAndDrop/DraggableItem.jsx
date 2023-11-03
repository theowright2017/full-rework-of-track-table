import { useDrag } from "react-dnd";

export const DraggableItem = (props) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    item: props.item,
    type: props.type,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return props.children(drag);
};
