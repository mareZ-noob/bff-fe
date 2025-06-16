import React from "react";
import { Link } from "react-router-dom";
import { Path } from "@/utils/path";

const LoginPage: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
					<p className="mt-2 text-gray-600">
						Login to access your AI Assistant.
					</p>
				</div>

				<a
					href="/oauth2/authorization/keycloak"
					className="w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
				>
					Login with Keycloak
				</a>

				<p className="text-sm text-center text-gray-500">
					Don't have an account?{" "}
					<Link
						to={Path.register.index}
						className="font-medium text-blue-600 hover:underline"
					>
						Register here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
