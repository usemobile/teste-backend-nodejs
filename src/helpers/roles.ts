export const ROLES = {
    ROLE_ADMIN: 'Admin',
    ROLE_USER: 'User'
};

export function verify(role: string) {
    return role === ROLES.ROLE_USER || role === ROLES.ROLE_ADMIN;
}

module.exports = {
    roles: ROLES,
    verify: verify
};