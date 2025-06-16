import React from "react";
import { Route, Routes } from "react-router-dom";
import { Path } from "@/utils/path";

// Layouts
import NavigationLayout from "@/layouts/NavigationLayout";
import PublicLayout from "@/layouts/PublicLayout";

// Page Components
import WelcomePage from "@/pages/welcome/WelcomePage";
import AboutPage from "@/pages/about/AboutPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import NotFoundPage from "@/pages/notfound/NotFoundPage";
import ForumPage from "@/pages/forum/ForumPage";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public routes accessible to all users */}
			<Route element={<PublicLayout />}>
				<Route path={Path.root.index} element={<WelcomePage />} />
				<Route path={Path.about.index} element={<AboutPage />} />
			</Route>

			{/* Authentication routes for unauthenticated users */}
			<Route element={<PublicRoute />}>
				<Route path={Path.login.index} element={<LoginPage />} />
				<Route path={Path.register.index} element={<RegisterPage />} />
				<Route
					path={Path.forgotPassword.index}
					element={<ForgotPasswordPage />}
				/>
				<Route
					path={Path.resetPassword.index}
					element={<ResetPasswordPage />}
				/>
			</Route>

			{/* Protected routes for authenticated users */}
			<Route element={<ProtectedRoute />}>
				<Route element={<NavigationLayout />}>
					<Route
						path={Path.user.outlets.dashboard}
						element={<DashboardPage />}
					/>
					<Route path={Path.user.outlets.profile} element={<ProfilePage />} />
					<Route path={Path.forum.index} element={<ForumPage />} />
				</Route>
			</Route>

			{/* Fallback for any other route */}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default AppRoutes;
