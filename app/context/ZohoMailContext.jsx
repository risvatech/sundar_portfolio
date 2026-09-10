// app/context/ZohoMailContext.jsx
"use client";

import React, { createContext, useContext, useState, } from "react";
import { useToast } from "@/app/hooks/use-toast";
import { useApiMutation } from "@/app/hooks/useApiMutation";

const ZohoMailContext = createContext(undefined);

export const ZohoMailProvider = ({ children }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // ==================== API MUTATIONS ====================

  // Get Settings Mutation
  const getSettingsMutation = useApiMutation({
    url: "/settings/general",
    method: "get",
    onSuccessExtra: (data) => {
      console.log("✅ Settings fetched successfully:", data);
    },
    onErrorExtra: (error) => {
      console.error("❌ Failed to fetch settings:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to fetch settings",
        variant: "destructive",
      });
    },
  });

  // Update Settings Mutation
  const updateSettingsMutation = useApiMutation({
    url: "/settings/general",
    method: "put",
    onSuccessExtra: (data) => {
      console.log("✅ Settings updated successfully:", data);
      toast({
        title: "Success",
        description: data?.message || "Settings updated successfully",
      });
    },
    onErrorExtra: (error) => {
      console.error("❌ Failed to update settings:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  // Send Mail Mutation
  const sendMailMutation = useApiMutation({
    url: "/zoho/send",
    method: "post",
    onSuccessExtra: (data) => {
      console.log("✅ Mail sent successfully:", data);
      toast({
        title: "Success",
        description: data?.message || "Email sent successfully",
      });
    },
    onErrorExtra: (error) => {
      console.error("❌ Failed to send mail:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send email",
        variant: "destructive",
      });
    },
  });

  // ==================== CONTROLLER FUNCTIONS ====================

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettingsMutation.mutateAsync({});

      // Handle different response formats
      let data;
      if (response?.success && response?.data) {
        data = response.data;
      } else if (response?.data) {
        data = response.data;
      } else {
        data = response;
      }

      // If data is null or empty, create default settings
      if (!data || !data.id) {
        console.log("ℹ️ No settings found, creating default settings...");
        await createDefaultSettings();
        return;
      }

      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      // If settings not found, create default
      if (error?.response?.status === 404) {
        await createDefaultSettings();
      }
    } finally {
      setLoading(false);
    }
  };

  // Create default settings
  const createDefaultSettings = async () => {
    try {
      const response = await updateSettingsMutation.mutateAsync({
        toMailAddress: "",
        customData: {
          initialized: true,
          initializedAt: new Date().toISOString(),
        },
      });

      let data;
      if (response?.success && response?.data) {
        data = response.data;
      } else if (response?.data) {
        data = response.data;
      } else {
        data = response;
      }

      setSettings(data);
      console.log("✅ Default settings created successfully");
    } catch (error) {
      console.error("❌ Failed to create default settings:", error);
      toast({
        title: "Error",
        description: "Failed to initialize settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update settings
  const updateSettings = async (data) => {
    setLoading(true);
    try {
      const response = await updateSettingsMutation.mutateAsync(data);

      let result;
      if (response?.success && response?.data) {
        result = response.data;
      } else if (response?.data) {
        result = response.data;
      } else {
        result = response;
      }

      setSettings(result);
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send mail
  const sendMail = async (data) => {
    setIsSending(true);
    try {
      const response = await sendMailMutation.mutateAsync(data);

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send mail:", error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  // Test mail
  const testMail = async (toAddress) => {
    setIsTesting(true);
    try {
      const testData = {
        subject: "Test Email - Zoho Mail Integration",
        firstName: "Test User",
        phone: "N/A",
        email: "test@example.com",
        notes: `This is a test email to verify Zoho Mail integration.\n\nTo: ${toAddress}\nSent at: ${new Date().toLocaleString()}\n\nThis is a test message from the Zoho Mail integration settings page.`,
      };

      await sendMailMutation.mutateAsync(testData);
      toast({
        title: "Success",
        description: `Test email sent to ${toAddress}`,
      });
    } catch (error) {
      console.error("Failed to send test mail:", error);
      toast({
        title: "Error",
        description:
          "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <ZohoMailContext.Provider
      value={{
        settings,
        loading,
        fetchSettings,
        updateSettings,
        sendMail,
        isSending,
        testMail,
        isTesting,
      }}
    >
      {children}
    </ZohoMailContext.Provider>
  );
};

// Hook
export const useZohoMail = () => {
  const context = useContext(ZohoMailContext);
  if (!context) {
    throw new Error("useZohoMail must be used within a ZohoMailProvider");
  }
  return context;
};
