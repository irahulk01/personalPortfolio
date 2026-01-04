// src/hooks/useContactForm.ts
import { useState } from "react";
import { submitContactForm } from "../api/contactApi.ts";

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
      const res = await submitContactForm(data);

      if (res.status === 201) {
        setSuccessMessage("Form submitted successfully!");
        return true;
      }

      setDuplicateError("Submission failed. Please try again.");
      return false;
    } catch (err: any) {
      // backend duplicate email handling
      if (err?.response?.status === 409) {
        setDuplicateError("This email already exists.");
      } else {
        setDuplicateError("Something went wrong. Please try again.");
      }
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