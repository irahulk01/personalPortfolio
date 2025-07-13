// src/hooks/useContactForm.ts
import { useState } from "react";
import { fetchAllContacts, submitContactForm } from "../api/contactApi.ts";

export const useContactForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (data: {
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
  }) => {
    setSuccessMessage(null);
    setDuplicateError(null);
    setLoading(true);

    try {
      const allContacts = await fetchAllContacts();
      const emailExists = allContacts.some((c: any) => c.email === data.email);
      const phoneExists = allContacts.some((c: any) => c.phoneNumber === data.phoneNumber);

      if (emailExists) {
        setDuplicateError("This email already exists.");
        return false;
      }

      if (phoneExists) {
        setDuplicateError("This phone number already exists.");
        return false;
      }

      const res = await submitContactForm(data);
      if (res.status === 201) {
        setSuccessMessage("Form submitted successfully!");
        return true;
      } else {
        setDuplicateError("Submission failed. Please try again.");
        return false;
      }
    } catch (err) {
      setDuplicateError("Something went wrong.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleContactSubmit,
    successMessage,
    duplicateError,
    loading,
  };
};