import {
    pgTable, varchar, text, integer, serial, timestamp, boolean, jsonb
} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';

// ===========================
// USER MANAGEMENT
// ===========================

// --- ROLES TABLE ---
export const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).unique().notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    description: text("description"),
    isSystem: boolean("is_system").default(false),
    permissions: jsonb("permissions").default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// --- USERS TABLE ---
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    roleId: integer("role_id").references(() => roles.id, { onDelete: 'set null' }),
    status: varchar("status").default("active"),
    profileImageUrl: varchar("profile_image_url"),
    createdBy: integer("created_by").references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const userPermissions = pgTable("user_permissions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    module: varchar("module").notNull(),
    enabled: boolean("enabled").default(false),
    canRead: boolean("can_read").default(false),
    canWrite: boolean("can_write").default(false),
    canDelete: boolean("can_delete").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    type: varchar("type").notNull(),
    description: text("description").notNull(),
    entityType: varchar("entity_type"),
    entityId: varchar("entity_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    createdBy: integer("created_by").notNull().references(() => users.id),
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
});

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    status: varchar("status", { length: 20 }).default("draft"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    coverImage: text("cover_image"),
    publishDate: timestamp("publish_date"),

    // ✅ Added fields:
    description: text("description"), // Could be used for a longer summary
    tags: text("tags"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaKeywords: text("meta_keywords"),
    metaDescription: text("meta_description"),


    // Category reference (foreign key)
    categoryId: integer("category_id").references(() => categories.id),
});

export const quotes = pgTable('quotes', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    company: varchar('company', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    country: varchar('country', { length: 100 }).default('India').notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    city: varchar('city', { length: 100 }).notNull(),

    // Project Details
    projectType: varchar('project_type', { length: 100 }).notNull(),
    productType: varchar('product_type', { length: 255 }),
    quantity: varchar('quantity', { length: 100 }),
    deliveryDate: varchar('delivery_date', { length: 20 }),
    budget: varchar('budget', { length: 50 }).notNull(),
    additionalRequirements: text('additional_requirements'),
    // Metadata
    status: varchar('status', { length: 20 }).default('pending').notNull(), // pending, contacted, quoted, closed
    quoteReference: varchar('quote_reference', { length: 50 }),
    source: varchar('source', { length: 50 }).default('website'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Consultation Request Table
// In your schema.js
export const consultationRequests = pgTable('consultation_requests', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    company: varchar('company', { length: 100 }).notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    location: varchar('location', { length: 100 }).notNull(),
    serviceType: varchar('service_type', { length: 50 }).notNull(),
    description: text('description').notNull(),
    status: varchar('status', { length: 20 }).default('pending'),
    notes: text('notes'),
    isFollowedUp: boolean('is_followed_up').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Gallery Category Table
export const galleryCategories = pgTable('gallery_categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Gallery Items Table (for multiple images)
export const galleryItems = pgTable('gallery_items', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    imageUrls: text('image_urls'), // Store as JSON string
    categoryId: integer('category_id').references(() => galleryCategories.id, {
        onDelete: 'SET NULL'
    }),
    isActive: boolean('is_active').default(true),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});


// ===========================
// RELATIONS
// ===========================

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
    createdByUser: one(users, {
        fields: [users.createdBy],
        references: [users.id],
    }),
    permissions: many(userPermissions),
    activities: many(activities),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
    user: one(users, {
        fields: [userPermissions.userId],
        references: [users.id],
    }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
    user: one(users, {
        fields: [activities.createdBy],
        references: [users.id],
    }),
}));

