export type Student = {
  id: string;
  name: string;
  code: string;
  course: string;
  campus: string;
  noStudent?: boolean;
};

const studentListGenerator = (): Student[] => {
  const items = Array.from({ length: 50 }, (_, idx) => idx).map((index) => {
    const student: Student = {
      id: index.toString(),
      name: index % 2 === 0 ? "Tom Crawley" : "Ben Kingsley",
      code: index.toString(),
      course: index % 2 === 0 ? "Engineering" : "Humanities",
      campus: index % 2 === 0 ? "Bristol" : "Edinburgh",
    };
    return student;
  });

  return items;
};

export default studentListGenerator();
