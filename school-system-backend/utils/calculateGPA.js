/*
 Utility to compute grade points and GPA for Ethiopian high school format.
 */

const calculateGradePoint = (percentage) => {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
};

const calculateGPA = (results) => {
  if (!Array.isArray(results) || results.length === 0) return { gpa: 0, gradePoints: [] };

  const gradePoints = results.map((r) => {
    const total = r.ca + r.final;
    const point = calculateGradePoint(total);
    return { ...r, total, gradePoint: point };
  });

  const sumPoints = gradePoints.reduce((acc, curr) => acc + curr.gradePoint, 0);
  const gpa = parseFloat((sumPoints / gradePoints.length).toFixed(2));

  return { gpa, gradePoints };
};

module.exports = { calculateGradePoint, calculateGPA };
