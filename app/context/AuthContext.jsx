"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useApiMutation } from "../hooks/useApiMutation.jsx";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import api from "../service/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // -------------------
  // State
  // -------------------
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPermission, setUserPermission] = useState({});
  const [allowedModules, setAllowedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Get current path
  const pathname = usePathname();

  const modules = [
    "leads",
    "extractor",
    "followups",
    "qualification",
    "customers",
    "deals",
    "quotes",
    "catalog",
    "invoices",
    "payments",
    "reports",
    "aiInsights",
    "aiAssistant",
    "users",
    "settings",
  ];

  // -------------------
  // Forms
  // -------------------
  const authForm = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      roleId: 0,
      status: "",
      createdBy: 0,
    },
  });

  const changePwdForm = useForm({
    mode: "all",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  // -------------------
  // Fetch current user only when in /cms
  // -------------------
  useEffect(() => {
    // Only fetch if we're in /cms route
    if (!pathname?.startsWith("/cms")) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    api
      .get("/auth/get")
      .then((res) => {
        if (isMounted) {
          setUser(res.data);
          // Fetch users only after user is successfully fetched
          if (res.data) {
            fetchUsers();
          }
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // -------------------
  // Fetch users function - only called when user is logged in
  // -------------------
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/get");
      setUsers(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    }
  };

  // -------------------
  // Mutations (POST, PUT, DELETE only)
  // -------------------
  const loginMutation = useApiMutation({
    url: "/auth/login",
    method: "post",
    successMsg: "Login successful!",
    onSuccessExtra: (data) => {
      setCurrentUser(data);
      // Redirect to CMS after login
      window.location.href = "/cms";
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const registerMutation = useApiMutation({
    url: "/register",
    method: "post",
    successMsg: "Registration successful!",
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Register failed");
    },
  });

  const logoutMutation = useApiMutation({
    url: "/auth/logout",
    method: "post",
    successMsg: "Logout successful!",
    onSuccessExtra: () => {
      window.location.href = "/";
    },
    onErrorExtra: () => {
      toast.error("Logout failed");
    },
  });

  const changePwdMutation = useApiMutation({
    url: "/change-password",
    method: "post",
    successMsg: "Password changed successfully!",
    onSuccessExtra: () => {
      logoutMutation.mutate();
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Password change failed");
    },
  });

  const createUserMutation = useApiMutation({
    url: "/users/create",
    method: "post",
    successMsg: "Added user successfully",
    onSuccessExtra: () => {
      toast.success("Added user successfully");
      fetchUsers(); // Refresh users list
      authForm.reset();
      setIsUserDialogOpen(false);
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Add failed");
    },
  });

  const updateUserMutation = useApiMutation({
    url: (userId) => `/users/update/${userId}`,
    method: "put",
    successMsg: "User updated successfully",
    onSuccessExtra: () => {
      toast.success("User updated successfully");
      setEditingUser(null);
      authForm.reset();
      setIsUserDialogOpen(false);
      fetchUsers(); // Refresh users list
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  const updateUserPasswordMutation = useApiMutation({
    url: (userId) => `/users/password/${userId}`,
    method: "put",
    successMsg: "User password updated successfully",
    onSuccessExtra: () => {
      fetchUsers(); // Refresh users list
      toast.success("Password updated successfully");
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  const updateUserRoleMutation = useApiMutation({
    url: (userId) => `/users/role/${userId}`,
    method: "put",
    successMsg: "User role updated successfully",
    onSuccessExtra: () => fetchUsers(),
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  // GET permissions - using direct API call instead of useApiMutation
  const fetchUserPermissions = async (userId) => {
    try {
      const response = await api.get(`/users/permission/${userId}`);
      const data = response.data;

      const permsMap = {};
      const allowed = [];

      modules.forEach((mod) => {
        const found = data.permissions.find(
          (p) => p.module.toLowerCase() === mod.toLowerCase(),
        );
        if (found?.enabled) allowed.push(mod);

        permsMap[mod] = found
          ? {
              enabled: found.enabled,
              canRead: found.canRead,
              canWrite: found.canWrite,
              canDelete: found.canDelete,
            }
          : {
              enabled: false,
              canRead: false,
              canWrite: false,
              canDelete: false,
            };
      });

      setUserPermission(permsMap);
      setAllowedModules(allowed);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error(error.response?.data?.message || "Fetch failed");
    }
  };

  useEffect(() => {
    // Only fetch permissions if we're in /cms and have a user
    if (pathname?.startsWith("/cms") && user?.id) {
      fetchUserPermissions(user.id);
    }
  }, [user, pathname]);

  const updateUserPermissionMutation = useApiMutation({
    url: (userId) => `/users/permission/${userId}`,
    method: "put",
    successMsg: "User permission updated successfully",
    onSuccessExtra: () => {
      setShowPermissionsModal(false);
      fetchUsers(); // Refresh users list
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  // -------------------
  // Provider
  // -------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginMutation,
        registerMutation,
        logoutMutation,
        loading,
        authForm,
        users,
        setUsers,
        getAllUsersMutation: { mutate: fetchUsers }, // Provide as mutation-like object for compatibility
        createUserMutation,
        updateUserMutation,
        updateUserPasswordMutation,
        updateUserRoleMutation,
        getUserPermissionMutation: { mutate: fetchUserPermissions },
        userPermission,
        setUserPermission,
        modules,
        updateUserPermissionMutation,
        currentUser,
        setCurrentUser,
        isUserDialogOpen,
        setIsUserDialogOpen,
        editingUser,
        setEditingUser,
        showPermissionsModal,
        setShowPermissionsModal,
        changePwdMutation,
        changePwdForm,
        allowedModules,
        setAllowedModules,
        isInCms: pathname?.startsWith("/cms"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
