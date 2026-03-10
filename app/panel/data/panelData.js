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

// Department configurations
export const DEPARTMENTS = [
  { id: 'PR', name: 'Public Relations', color: 'bg-blue-100 text-blue-800' },
  { id: 'CW', name: 'Content Writing', color: 'bg-purple-100 text-purple-800' },
  { id: 'EM', name: 'Event Management', color: 'bg-amber-100 text-amber-800' },
  { id: 'WG', name: 'Web & Graphics', color: 'bg-[#EBF4E6] text-[#2E5940]' },
  { id: 'Logistics', name: 'Logistics', color: 'bg-[#F2ECE4] text-[#7D5A3C]' },
];

export const isGlobalRole = (rankLevel) => rankLevel >= ROLE_HIERARCHY.OS || rankLevel === ROLE_HIERARCHY.BatchAmbassador;
