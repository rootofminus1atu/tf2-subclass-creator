import { auth } from "express-oauth2-jwt-bearer/dist";
import { Loadout } from "./models/loadout";
import { Request, Response, NextFunction } from "express";


type Role = "admin" | "moderator" | "user"
const DEFAULT_ROLE = 'user';
type User = {
    id: string;
    roles?: Role[];
};

type Permissions = {
    loadouts: {
        dataType: Loadout;
        action: 'view' | 'create' | 'update' | 'delete';
    };
};

type PermissionCheck<Key extends keyof Permissions> =
    | boolean
    | ((user: User, data: Permissions[Key]['dataType']) => boolean);

type RolesWithPermissions = {
    [role: string]: {
        [Key in keyof Permissions]?: Partial<{
            [Action in Permissions[Key]['action']]: PermissionCheck<Key>;
        }>;
    };
};

const ROLES: RolesWithPermissions = {
    user: {
        loadouts: {
            view: true,
            create: true,
            update: (user, loadout) => loadout.userId === user.id,
            delete: (user, loadout) => loadout.userId === user.id,
        },
    },
};

export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]['action'],
    data?: Permissions[Resource]['dataType']
): boolean {
    const roles = user.roles?.length ? user.roles : [DEFAULT_ROLE];

    return roles.some((role) => {
    const permission = ROLES[role]?.[resource]?.[action];
    if (permission == null) return false;

    if (typeof permission === 'boolean') return permission;
        return data != null && permission(user, data);
    });
}



export const jwtCheck = auth({
    audience: 'https://tf2scapi',
    issuerBaseURL: 'https://dev-fg28cspzvpoubaeb.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    jwtCheck(req, res, (err) => {
        // just a hack to extract the user id without it erroring out
        next();
    });
};