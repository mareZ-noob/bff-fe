import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Path } from "@/utils/path";

const ProtectedRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	return isAuthenticated ? (
		<Outlet />
	) : (
		<Navigate to={Path.login.path} replace />
	);
};

export default ProtectedRoute;
