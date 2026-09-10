import React, { createContext, useContext } from "react";
import { useApiMutation } from "../hooks/useApiMutation.jsx";
import toast from "react-hot-toast";

const ContactsContext = createContext();

export const ContactsProvider = ({ children }) => {
  // Contact Form - Create Enquiry
  const contactMutation = useApiMutation({
    url: "/enquiries/create",
    method: "post",
    onSuccessExtra: (data) => {
      toast.success(data?.message || "Message sent successfully!");
    },
    onErrorExtra: (error) => {
      console.error("Contact mutation error:", error);
      toast.error(error.response?.data?.message || "Failed to send message.");
    },
  });

  // GET Enquiries with pagination and filters
  const getEnquiriesMutation = useApiMutation({
    url: "/enquiries/get",
    method: "get",
    onSuccessExtra: (data) => {
      // Success is handled in the component
    },
    onErrorExtra: (error) => {
      console.error("Get enquiries error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch enquiries");
    },
  });

  // GET Enquiry by ID
  const getEnquiryByIdMutation = useApiMutation({
    url: (id) => `/enquiries/get/${id}`,
    method: "get",
    onSuccessExtra: (data) => {
      // Success is handled in the component
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch enquiry");
    },
  });

  // UPDATE Enquiry
  const updateEnquiryMutation = useApiMutation({
    url: (id) => `/enquiries/update/${id}`,
    method: "put",
    onSuccessExtra: () => {
      toast.success("Enquiry updated successfully");
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Failed to update enquiry");
    },
  });

  // DELETE Enquiry
  const deleteEnquiryMutation = useApiMutation({
    url: (id) => `/enquiries/delete/${id}`,
    method: "delete",
    onSuccessExtra: () => {
      toast.success("Enquiry deleted successfully");
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete enquiry");
    },
  });

  // UPDATE Enquiry Status Only (for marking as read, replied, archived, spam)
  const updateStatusMutation = useApiMutation({
    url: (id) => `/enquiries/status/${id}`,
    method: "patch",
    onSuccessExtra: () => {
      toast.success("Status updated successfully");
    },
    onErrorExtra: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // GET Enquiries by Service
  const getEnquiriesByServiceMutation = useApiMutation({
    url: (serviceId) => `/enquiries/service/${serviceId}`,
    method: "get",
    onSuccessExtra: (data) => {
      // Success is handled in the component
    },
    onErrorExtra: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch enquiries by service",
      );
    },
  });

  // GET Enquiries by Assignee
  const getEnquiriesByAssigneeMutation = useApiMutation({
    url: (userId) => `/enquiries/assignee/${userId}`,
    method: "get",
    onSuccessExtra: (data) => {
      // Success is handled in the component
    },
    onErrorExtra: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch enquiries by assignee",
      );
    },
  });

  // Send Zoho Message
  const sendZohoMessageMutation = useApiMutation({
    url: "/zoho/send",
    method: "post",
    onSuccessExtra: () => {
      toast.success("Message sent successfully!");
    },
    onErrorExtra: (error) => {
      console.error("Zoho message error:", error);
      toast.error(error.response?.data?.message || "Message not sent");
    },
  });

  return (
    <ContactsContext.Provider
      value={{
        // Contact form
        contactMutation,

        // Enquiry CRUD
        getEnquiriesMutation,
        getEnquiryByIdMutation,
        updateEnquiryMutation,
        deleteEnquiryMutation,
        updateStatusMutation,

        // Enquiry filters
        getEnquiriesByServiceMutation,
        getEnquiriesByAssigneeMutation,

        // Zoho
        sendZohoMessageMutation,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};
