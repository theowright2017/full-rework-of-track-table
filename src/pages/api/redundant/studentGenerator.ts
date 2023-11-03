export type Student = {
  id: number;
  name: string;
  code: string;
  course: string;
  campus: string;
};

const studentListGenerator = (): Student[] => {
  const items = Array.from({ length: 10 }, (_, idx) => idx).map((index) => {
    const student: Student = {
      id: index,
      name: index % 2 === 0 ? "Tom Crawley" : "Ben Kingsley",
      code: index % 2 === 0 ? "XS123" : "AB5676",
      course: index % 2 === 0 ? "Engineering" : "Humanities",
      campus: index % 2 === 0 ? "Bristol" : "Edinburgh",
    };
    return student;
  });

  return items;
};

export default studentListGenerator();
