// lib/data.ts (Corrected and Secure Version)

// This object contains all PUBLIC information about departments.
// The PINs have been removed as they are a security risk on the client-side.
export const departments = {
  cs: { name: "Computer & Information Sciences", abbr: "CIS", gradient: "from-slate-600 to-slate-700" },
  ee: { name: "Electrical Engineering", abbr: "EE", gradient: "from-blue-600 to-blue-700" },
  che: { name: "Chemical Engineering", abbr: "CHE", gradient: "from-teal-600 to-teal-700" },
  me: { name: "Mechanical Engineering", abbr: "ME", gradient: "from-gray-600 to-gray-700" },
  phy: { name: "Physics", abbr: "PHY", gradient: "from-indigo-600 to-indigo-700" },
  mme: { name: "Metallurgy and Materials Engineering", abbr: "MME", gradient: "from-slate-700 to-slate-800" }
};

// This initial data is fine here, as it's just for the initial page load before real-time takes over.
export const initialTokenData = {
  cs: 1,
  ee: 1,
  ce: 4,
  me: 7,
  cv: 1,
  ms: 1
};

// Define a type for our department keys for better TypeScript support
export type DepartmentId = keyof typeof departments;