export type Student = {
  id: number;
  name: string;
  code: string;
  course: string;
  campus: string;
};

const studentListGenerator = () => {
  return Array.from({ length: 50 }, (_, idx) => idx).map((index) => {
    const student: Student = {
      id: index,
      name: `Thomas Crawley ${index}`,
      code: "DF1223",
      course: "Engineering",
      campus: "Bristol",
    };
    return student;
  });
};

export default studentListGenerator();
