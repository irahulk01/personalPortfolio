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
    console.log(data, "formdata")
    const success = await handleContactSubmit(data);
    if (success) reset();
  };

  return (
    <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="example@example.com"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
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
              inputClass="!w-80% !px-8 !py-2 !border !border-gray-300 !rounded-md !text-sm !shadow-sm !placeholder-gray-400 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
              buttonClass="!border-r !border-gray-300 !bg-white !rounded-l-md"
              specialLabel=""
              enableSearch
            />
          )}
        />
        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Project Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Tell us about your project..."
          {...register("description")}
        ></textarea>
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#3e4355] text-white py-2 px-4 rounded-lg hover:bg-[#292e40]"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Hire Me"}
        </button>
      </div>

      {/* Messages */}
      <div className="mt-4 text-center">
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {duplicateError && <p className="text-red-500">{duplicateError}</p>}
      </div>
    </form>
  );
}