import React, { useState } from "react";
import { Link } from "react-router-dom";
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
	// (Your existing state and handler logic remains the same)
	const [registerForm, setRegisterForm] = useState<RegisterFormData>({
		username: "",
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		role: "USER",
	});
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setRegisterForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleRegisterSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");
		try {
			const response = await fetch("/api/customer/customers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(registerForm),
			});
			if (response.ok) {
				setMessage("Registration successful! Please proceed to login.");
				setRegisterForm({
					username: "",
					email: "",
					firstName: "",
					lastName: "",
					password: "",
					role: "USER",
				});
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
				<form onSubmit={handleRegisterSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							name="username"
							value={registerForm.username}
							onChange={handleInputChange}
							className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={registerForm.email}
							onChange={handleInputChange}
							className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							First Name
						</label>
						<input
							type="text"
							name="firstName"
							value={registerForm.firstName}
							onChange={handleInputChange}
							className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Last Name
						</label>
						<input
							type="text"
							name="lastName"
							value={registerForm.lastName}
							onChange={handleInputChange}
							className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={registerForm.password}
							onChange={handleInputChange}
							className="mt-1 p-3 w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
							required
						/>
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
						className={`mt-4 p-4 rounded-md text-sm text-center ${message.startsWith("Registration successful") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
					>
						{message}
					</div>
				)}
				<p className="text-sm text-center text-gray-500">
					Already have an account?{" "}
					<Link
						to={Path.login.index}
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
