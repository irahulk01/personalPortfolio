"use client";

import './formOverrides.css';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { useContactForm } from "../../hooks/useContactForm.ts";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  description: yup.string().default(""),
});

type FormData = yup.InferType<typeof schema>;

export default function ContactForm() {
  const {
    handleContactSubmit,
    successMessage,
    duplicateError,
    loading,
  } = useContactForm();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      description: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    const success = await handleContactSubmit(data);
    if (success) reset();
  };

  return (
    <form className="w-full bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-5 border border-white/80" onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div className="mb-3">
        <label className="block text-gray-700 text-xs font-bold mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          autoFocus
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-highLighter focus:border-highLighter"
          placeholder="Enter your name"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-gray-700 text-xs font-bold mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-highLighter focus:border-highLighter"
          placeholder="example@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="mb-3">
        <label className="block text-gray-700 text-xs font-bold mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInput
              country={'in'}
              value={field.value}
              onChange={field.onChange}
              containerClass="w-full"
              inputClass="!w-full !px-12 !py-1.5 !border !border-gray-300 !rounded-lg !text-sm !shadow-sm !placeholder-gray-400 focus:!outline-none focus:!ring-2 focus:!ring-highLighter focus:!border-highLighter"
              buttonClass="!border-r !border-gray-300 !bg-white !rounded-l-lg"
              specialLabel=""
              enableSearch
            />
          )}
        />
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-0.5">{errors.phoneNumber.message}</p>}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block text-gray-700 text-xs font-bold mb-1">
          Send Message
        </label>
        <textarea
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-highLighter focus:border-highLighter"
          rows={3}
          placeholder="Start the Conversation"
          {...register("description")}
        ></textarea>
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="w-full bg-[#3e4355] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#292e40] shadow-md transition-colors text-sm"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Send Message"}
        </button>
      </div>

      {/* Messages */}
      <div className="mt-2 text-center text-xs">
        {successMessage && <p className="text-green-600 font-semibold">{successMessage}</p>}
        {duplicateError && <p className="text-red-500 font-semibold">{duplicateError}</p>}
      </div>
    </form>
  );
}