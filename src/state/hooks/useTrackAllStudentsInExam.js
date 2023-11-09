import { useState, useCallback } from "react";

export function useStudentsInTracksSet(studentsFromIndex) {
  const [studentsAssignedSet, setStudentsAssignedSet] = useState(
    new Set([...studentsFromIndex.map((stu) => stu.id)])
  );

  const addStudentId = useCallback((id) => {
    setStudentsAssignedSet((prev) => new Set(prev.add(id)));
  });

  const deleteStudentId = useCallback((id) => {
    setStudentsAssignedSet((prev) => {
      prev.delete(id);
      return new Set(prev);
    });
  });

  return {
    studentsAssignedSet,
    addStudentId,
    deleteStudentId,
  };
}
