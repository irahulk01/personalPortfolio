import { useState } from "react";
import { databases, DATABASE_ID, FormDataID as COLLECTION_ID, ID } from '../../appwrite/appwriteConfig';

export default function ContactForm() {
  const initialFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[0-9]*$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      console.error('Form submission failed due to validation errors');
      return;
    }

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        formData
      );
      if (response.$id) {
        setSuccessMessage("Form submitted successfully!");
        setFormData(initialFormData);
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name" && value.trim() === "") {
      setErrors({ ...errors, [name]: "Name is required" });
    } else if (name === "email" && !validateEmail(value)) {
      setErrors({ ...errors, [name]: "Invalid email address" });
    } else if (name === "phoneNumber" && !validatePhoneNumber(value)) {
      setErrors({ ...errors, [name]: "Invalid phone number" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <>
      <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Phone No.
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter Your Phone No. With Country Code"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Mail Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="example@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            className="horizontal w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Tell us about your project..."
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`bg-[#3e4355] text-white py-2 px-4 rounded-lg hover:bg-[#292e40] ${(!formData.name || !formData.email || Object.values(errors).some(error => error !== ""))
              ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!formData.name || !formData.email || Object.values(errors).some(error => error !== "")}
          >
            Hire Me
          </button>
        </div>
        <div className="flex justify-end lg:justify-center">
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </form>
    </>
  );
}
