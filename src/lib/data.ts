// lib/data.ts (Corrected and Secure Version)

// This object contains all PUBLIC information about departments.
// The PINs have been removed as they are a security risk on the client-side.
export const departments = {
  cs: { name: "Computer & Information Sciences", abbr: "CIS", gradient: "from-slate-700 to-slate-800" },
  ee: { name: "Electrical Engineering", abbr: "EE", gradient: "from-blue-600 to-blue-700" },
  che: { name: "Chemical Engineering", abbr: "CHE", gradient: "from-yellow-600 to-yellow-700" },
  me: { name: "Mechanical Engineering", abbr: "ME", gradient: "from-purple-600 to-purple-700" },
  phy: { name: "Physics", abbr: "PHY", gradient: "from-emerald-600 to-emerald-700" },
  mme: { name: "Metallurgy & Materials Engineering", abbr: "MME", gradient: "from-rose-600 to-rose-700" }
};

// This initial data is fine here, as it's just for the initial page load before real-time takes over.
export const initialTokenData = {
  cs: 0,
  ee: 0,
  ce: 0,
  me: 0,
  cv: 0,
  ms: 0
};

// Define a type for our department keys for better TypeScript support
export type DepartmentId = keyof typeof departments;