export function calculateLetterGrade(score: number): { letterGrade: string; gradePoint: number } {
  if (score >= 70) return { letterGrade: 'A', gradePoint: 5.0 };
  if (score >= 60) return { letterGrade: 'B', gradePoint: 4.0 };
  if (score >= 50) return { letterGrade: 'C', gradePoint: 3.0 };
  if (score >= 45) return { letterGrade: 'D', gradePoint: 2.0 };
  if (score >= 40) return { letterGrade: 'E', gradePoint: 1.0 };
  return { letterGrade: 'F', gradePoint: 0.0 };
}