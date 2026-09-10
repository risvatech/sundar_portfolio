import { z } from "zod";
import DOMPurify from "dompurify";

export const sanitizeInput = (value) => {
  if (typeof value !== "string") return value;

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }).trim();
};

export const sanitizeObject = (obj) => {
  const result = {};

  Object.keys(obj).forEach((key) => {
    result[key] = sanitizeInput(obj[key]);
  });

  return result;
};

// --------------------
// Consultation Form
// --------------------

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "First name is required"),

  company: z.string().trim().max(100, "Company name is too long").optional(),

  email: z.string().trim().email("Invalid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,15}$/, "Invalid phone number"),

  description: z.string().trim().min(10, "Please enter at least 10 characters"),
});

export const validateConsultation = (data) => {
  return consultationSchema.parse(sanitizeObject(data));
};

// --------------------
// Zoho Contact
// --------------------

export const zohoContactSchema = z.object({
  subject: z.string().trim().min(1),

  name: z.string().trim().min(2),

  email: z.string().trim().email(),

  phone: z.string().optional(),

  notes: z.string().trim().min(1),
});

export const validateZohoContact = (data) => {
  return zohoContactSchema.parse(sanitizeObject(data));
};

/* =====================================================
   LOGIN
===================================================== */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 8 characters"),
});

export const validateLoginData = (data) => {
  return loginSchema.parse(sanitizeObject(data));
};

/* =====================================================
   REGISTER
===================================================== */

export const registerSchema = z
  .object({
    username: z.string().trim().min(3).max(50),

    email: z.string().trim().email(),

    password: z.string().min(8),

    confirmPassword: z.string().min(8),

    firstName: z.string().trim().min(2).max(50),

    lastName: z.string().trim().min(2).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const validateRegisterData = (data) => {
  return registerSchema.parse(sanitizeObject(data));
};

/* =====================================================
   CHANGE PASSWORD
===================================================== */

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),

  newPassword: z.string().min(8),
});

/* =====================================================
   USER
===================================================== */

export const userSchema = z.object({
  username: z.string().trim().min(3).max(50),

  email: z.string().trim().email(),

  password: z.string().min(8).optional(),

  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().min(2).max(50),

  roleId: z.number(),

  status: z.string().trim().min(1),

  createdBy: z.number().optional(),
});

export const validateUserData = (data) => {
  return userSchema.parse(sanitizeObject(data));
};

/* =====================================================
   ROLE
===================================================== */

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(50),

  displayName: z.string().trim().min(2).max(50),

  description: z.string().optional(),

  isSystem: z.boolean(),

  permissions: z.record(z.any()).optional(),

  createdBy: z.number().optional(),
});

export const validateRoleData = (data) => {
  return roleSchema.parse(sanitizeObject(data));
};

/* =====================================================
   PERMISSION
===================================================== */

export const permissionSchema = z.object({
  module: z.string(),

  enabled: z.boolean(),

  canRead: z.boolean(),

  canWrite: z.boolean(),

  canDelete: z.boolean(),
});

export const validatePermissionData = (data) => {
  return permissionSchema.parse(sanitizeObject(data));
};
