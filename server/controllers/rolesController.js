import {db} from "../db/sql.js";
import { roles, activities, userPermissions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// Helper function to verify token (no console logging)
const verifyAuthToken = (req) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return { isValid: false, message: "Authentication required" };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { isValid: true, decoded };
    } catch {
        return { isValid: false, message: "Invalid or expired token" };
    }
};

// CREATE ROLE
export const createRole = async (req, res) => {
    // Check authentication
    const auth = verifyAuthToken(req);
    if (!auth.isValid) {
        return res.status(401).json({ message: auth.message });
    }

    const { name, displayName, description, isSystem, permissions, createdBy } =
        req.body;

    if (!name || !displayName) {
        return res
            .status(400)
            .json({ message: "name and displayName are required." });
    }

    try {
        const inserted = await db
            .insert(roles)
            .values({
                name,
                displayName,
                description,
                isSystem: isSystem ?? false,
                permissions: permissions ?? {},
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            .returning();

        const newRole = inserted[0];

        // ✅ log activity
        await db.insert(activities).values({
            type: "role_created",
            description: `Role ${newRole.displayName} created`,
            entityType: "role",
            entityId: newRole.id,
            createdBy: createdBy || auth.decoded?.username || 'system',
        });

        res.status(201).json({
            message: "Role created successfully",
            role: newRole,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ALL ROLES
export const getAllRoles = async (req, res) => {
    // Check authentication
    const auth = verifyAuthToken(req);
    if (!auth.isValid) {
        return res.json(null);
    }

    try {
        const allRoles = await db.select().from(roles);
        res.status(200).json(allRoles);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET ROLE BY ID
export const getRoleById = async (req, res) => {
    // Check authentication
    const auth = verifyAuthToken(req);
    if (!auth.isValid) {
        return res.json(null);
    }

    try {
        const { id } = req.params;

        const [role] = await db.select().from(roles).where(eq(roles.id, id));

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
    // Check authentication
    const auth = verifyAuthToken(req);
    if (!auth.isValid) {
        return res.status(401).json({ message: auth.message });
    }

    const { id } = req.params;
    const { name, displayName, description, isSystem, permissions, createdBy } =
        req.body;

    if (!name || !displayName) {
        return res
            .status(400)
            .json({ message: "name and displayName are required." });
    }

    try {
        const existingRole = await db
            .select()
            .from(roles)
            .where(eq(roles.id, Number(id)));

        if (existingRole.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        // 1️⃣ Update the role
        const updated = await db
            .update(roles)
            .set({
                name,
                displayName,
                description,
                isSystem: isSystem ?? false,
                permissions: permissions ?? {},
                updatedAt: new Date(),
            })
            .where(eq(roles.id, Number(id)))
            .returning();

        const updatedRole = updated[0];

        // 2️⃣ Sync permissions for all users with this role
        if (permissions && typeof permissions === "object") {
            const usersWithRole = await db
                .select()
                .from(users)
                .where(eq(users.roleId, Number(id)));

            for (const user of usersWithRole) {
                for (const [module, perms] of Object.entries(permissions)) {
                    await db
                        .insert(userPermissions)
                        .values({
                            userId: user.id,
                            module,
                            enabled: perms.enabled ?? false,
                            canRead: perms.read ?? false,
                            canWrite: perms.write ?? false,
                            canDelete: perms.delete ?? false,
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target: [userPermissions.userId, userPermissions.module],
                            set: {
                                enabled: perms.enabled ?? false,
                                canRead: perms.read ?? false,
                                canWrite: perms.write ?? false,
                                canDelete: perms.delete ?? false,
                                updatedAt: new Date(),
                            },
                        });
                }
            }
        }

        // 3️⃣ Log activity
        await db.insert(activities).values({
            type: "role_updated",
            description: `Role ${updatedRole.displayName} updated`,
            entityType: "role",
            entityId: updatedRole.id,
            createdBy: createdBy || auth.decoded?.username || 'system',
        });

        res.json({
            message: "Role updated successfully",
            role: updatedRole,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE ROLE
export const deleteRole = async (req, res) => {
    // Check authentication
    const auth = verifyAuthToken(req);
    if (!auth.isValid) {
        return res.status(401).json({ message: auth.message });
    }

    const { id } = req.params;

    try {
        // Get role info before deleting for activity log
        const [roleToDelete] = await db
            .select()
            .from(roles)
            .where(eq(roles.id, id));

        if (!roleToDelete) {
            return res.status(404).json({ message: "Role not found" });
        }

        const deletedRows = await db
            .delete(roles)
            .where(eq(roles.id, id))
            .returning();

        if (deletedRows.length === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        const deletedRole = deletedRows[0];

        // ✅ log activity
        await db.insert(activities).values({
            type: "role_deleted",
            description: `Role ${deletedRole.displayName} deleted`,
            entityType: "role",
            entityId: deletedRole.id,
            createdBy: auth.decoded?.username || 'system',
        });

        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};