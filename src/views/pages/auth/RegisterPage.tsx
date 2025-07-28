import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Path } from "@/utils/path";

interface RegisterFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "USER",
    },
  });

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/user/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setMessage("Registration successful! Please proceed to login.");
        reset(); // Reset form to default values
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(
          `Registration failed: ${errorData.message || "An unknown error occurred."}`,
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Error during registration: Network issue or server unavailable.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className={`mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className={`mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              className={`mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 p-4 rounded-md text-sm text-center ${
              message.startsWith("Registration successful")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to={Path.login.path}
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
