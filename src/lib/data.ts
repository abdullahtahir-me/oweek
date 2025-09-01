// This object contains all information about departments.
export const departments = {
  cs: { name: "Computer & Information Sciences", abbr: "CS", pin: "1234", gradient: "from-slate-600 to-slate-700" },
  ee: { name: "Electrical Engineering", abbr: "EE", pin: "5678", gradient: "from-blue-600 to-blue-700" },
  ce: { name: "Chemical Engineering", abbr: "CE", pin: "9012", gradient: "from-teal-600 to-teal-700" },
  me: { name: "Mechanical Engineering", abbr: "ME", pin: "3456", gradient: "from-gray-600 to-gray-700" },
  cv: { name: "Civil Engineering", abbr: "CV", pin: "7890", gradient: "from-indigo-600 to-indigo-700" },
  ms: { name: "Materials Science", abbr: "MS", pin: "2468", gradient: "from-slate-700 to-slate-800" }
};

// Initial token data for all departments. In a real app, this would come from Supabase.
export const initialTokenData = {
  cs: 87,
  ee: 112,
  ce: 45,
  me: 73,
  cv: 156,
  ms: 29
};

// Define a type for our department keys for better TypeScript support
export type DepartmentId = keyof typeof departments;