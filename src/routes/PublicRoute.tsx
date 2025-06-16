import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Path } from "@/utils/path";

const PublicRoute: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				Loading...
			</div>
		);
	}

	return isAuthenticated ? (
		<Navigate to={Path.user.outlets.dashboard} replace />
	) : (
		<Outlet />
	);
};

export default PublicRoute;
