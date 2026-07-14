// Role Hierarchy configurations
export const ROLE_HIERARCHY = {
  Advisor: 14,
  Treasurer: 13,
  President: 12,
  VP: 11,
  GS: 10,
  AGS: 9,
  JS: 8,
  OS: 7,
  HOD: 6,
  ExecutiveDirector: 5,
  Executive: 4,
  SubExecutive: 3,
  JuniorExecutive: 2,
  BatchAmbassador: 1,
};

// Department configurations (matching Junior Executive apply form teams)
export const DEPARTMENTS = [
  { id: 'Event Management', name: 'Event Management', color: 'bg-orange-100 text-orange-700' },
  { id: 'Logistics', name: 'Logistics', color: 'bg-amber-100 text-amber-700' },
  { id: 'Research & Development', name: 'Research & Development', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'Public Relationship', name: 'Public Relationship', color: 'bg-sky-100 text-sky-700' },
  { id: 'Content Writing', name: 'Content Writing', color: 'bg-violet-100 text-violet-700' },
  { id: 'Graphics', name: 'Graphics', color: 'bg-pink-100 text-pink-700' },
  { id: 'Web Development', name: 'Web Development', color: 'bg-blue-100 text-blue-700' },
];

export const isGlobalRole = (rankLevel) => rankLevel >= ROLE_HIERARCHY.OS || rankLevel === ROLE_HIERARCHY.BatchAmbassador;
