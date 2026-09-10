"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useApiMutation } from "../hooks/useApiMutation.jsx";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import api from "../service/api";
import { useAuth } from "./AuthContext.jsx";

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState({});
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const { user, isInCms, loading: authLoading } = useAuth();

  const rolesForm = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      isSystem: false,
      permissions: {},
      createdBy: 0,
    },
  });

  const fetchRoles = async () => {
    if (!user || !isInCms) {
      console.log("Cannot fetch roles: user or CMS condition not met");
      return;
    }

    setIsLoadingRoles(true);
    try {
      console.log("Fetching roles from /roles/get...");
      const response = await api.get("/roles/get");
      console.log("Roles API response:", response);

      const rolesData = response.data?.data || response.data || [];
      const rolesArray = Array.isArray(rolesData) ? rolesData : [];

      setRoles(rolesArray);
      console.log("Roles successfully set:", rolesArray);
      console.log("Total roles:", rolesArray.length);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      if (error.response) {
        console.error("Error response:", error.response);
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      toast.error(error.response?.data?.message || "Failed to fetch roles");
      setRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    console.log("RolesProvider useEffect triggered:", {
      authLoading,
      user: !!user,
      isInCms,
      userDetails: user,
    });

    if (!authLoading && user && isInCms) {
      fetchRoles();
    }
  }, [user, isInCms, authLoading]);

  // Force fetch on component mount if conditions are already met
  useEffect(() => {
    if (!authLoading && user && isInCms) {
      fetchRoles();
    }
  }, []);

  // Rest of your mutations remain the same...
  const createRolesMutation = useApiMutation({
    url: "/roles/create",
    method: "post",
    successMsg: "Added Roles successfully",
    onSuccessExtra: (data) => {
      toast.success("Added Roles successfully");
      fetchRoles();
      rolesForm.reset({
        name: "",
        displayName: "",
        description: "",
        isSystem: false,
        permissions: {},
        createdBy: 0,
      });
      setIsRoleDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Add failed");
    },
  });

  const deleteRolesMutation = useApiMutation({
    url: (roleId) => `/roles/delete/${roleId}`,
    method: "delete",
    successMsg: "Roles deleted successfully",
    onSuccessExtra: (data) => {
      toast.success("Roles deleted successfully");
      fetchRoles();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });

  const updateRolesMutation = useApiMutation({
    url: (roleId) => `/roles/update/${roleId}`,
    method: "put",
    successMsg: "Roles updated successfully",
    onSuccessExtra: (data) => {
      toast.success("Roles updated successfully");
      setEditingRole(null);
      rolesForm.reset({
        name: "",
        displayName: "",
        description: "",
        isSystem: false,
        permissions: {},
        createdBy: 0,
      });
      setIsRoleDialogOpen(false);
      fetchRoles();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  const fetchRoleById = async (roleId) => {
    try {
      const response = await api.get(`/roles/get/${roleId}`);
      setRole(response.data);
    } catch (error) {
      console.error("Failed to fetch role:", error);
      toast.error(error.response?.data?.message || "Fetch failed");
    }
  };

  return (
    <RolesContext.Provider
      value={{
        roles,
        setRoles,
        getRolesMutation: { mutate: fetchRoles, isLoading: isLoadingRoles },
        createRolesMutation,
        rolesForm,
        deleteRolesMutation,
        updateRolesMutation,
        role,
        setRole,
        getRolesByIdMutation: { mutate: fetchRoleById },
        isRoleDialogOpen,
        setIsRoleDialogOpen,
        editingRole,
        setEditingRole,
        isLoadingRoles,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
