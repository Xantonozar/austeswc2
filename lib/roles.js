export const ROLES = [
    'superadmin',
    'advisor',
    'treasurer',
    'president',
    'gs',
    'vp',
    'js',
    'os',
    'executive',
    'senior sub executive',
    'sub executive',
    'junior executive',
];

export const ROLE_LABELS = {
    'superadmin': 'Super Admin',
    'advisor': 'Advisor',
    'treasurer': 'Treasurer',
    'president': 'President',
    'gs': 'General Secretary',
    'vp': 'Vice President',
    'js': 'Joint Secretary',
    'os': 'Organizing Secretary',
    'executive': 'Executive',
    'senior sub executive': 'Senior Sub Executive',
    'sub executive': 'Sub Executive',
    'junior executive': 'Junior Executive',
};

export function canManage(managerRole, targetRole) {
    const managerIndex = ROLES.indexOf(managerRole);
    const targetIndex = ROLES.indexOf(targetRole);
    if (managerIndex === -1 || targetIndex === -1) return false;
    return managerIndex < targetIndex;
}

export function getSubordinates(role) {
    const idx = ROLES.indexOf(role);
    if (idx === -1) return [];
    return ROLES.slice(idx + 1);
}

export function hasPanelAccess(role) {
    return ROLES.indexOf(role) <= ROLES.indexOf('executive');
}
