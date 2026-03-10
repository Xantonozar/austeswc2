import { ROLE_HIERARCHY, isGlobalRole } from './panelData';

/**
 * Returns true if currentUser can evaluate targetMember based on rules:
 * 1. Target must have lower rankLevel than user.
 * 2. If user is rank >= 10 (VP+), can evaluate any department.
 * 3. If user is HOD (rank 5), can evaluate ONLY own dept members + Batch Ambassadors (rank 1).
 * 4. If user is rank < 5 (Exec/below), cannot evaluate anyone.
 * 5. Cannot evaluate self.
 */
export const canEvaluate = (currentUser, targetMember) => {
    if (!currentUser || !targetMember) return false;
    if (currentUser._id === targetMember._id) return false;

    // Rule 1: Must be strictly higher rank
    if (currentUser.rankLevel <= targetMember.rankLevel) return false;

    // Rule 4: Exec and below cannot evaluate anyone
    if (currentUser.rankLevel < ROLE_HIERARCHY.HOD) return false;

    // Rule 2 & 3: Scope check
    // Global roles (VP, President, etc.) can evaluate anyone below them
    if (currentUser.rankLevel >= ROLE_HIERARCHY.VP || isGlobalRole(currentUser.rankLevel)) {
        return true;
    }

    // HOD scope
    if (currentUser.rankLevel === ROLE_HIERARCHY.HOD) {
        // Can evaluate batch ambassadors of any dept
        if (targetMember.rankLevel === ROLE_HIERARCHY.BatchAmbassador) return true;
        // Or anyone in same dept
        return currentUser.department === targetMember.department;
    }

    return false;
};

/**
 * Returns true if currentUser can see the score of targetMember.
 * Rule: You can see the score if you are strictly higher rank, OR if it's yourself.
 * Non-evaluating roles (Exec and below) can only see their own score.
 * HODs can see scores of lower people in other depts (but can't evaluate them).
 */
export const canViewScore = (currentUser, targetMember) => {
    if (!currentUser || !targetMember) return false;
    if (currentUser._id === targetMember._id) return true; // Can see own score

    // Can see score of strictly lower ranks
    return currentUser.rankLevel > targetMember.rankLevel;
};
