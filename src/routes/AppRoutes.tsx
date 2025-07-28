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
import PaymentPage from "@/pages/payment/PaymentPage";
import PaymentSuccessPage from "@/pages/payment/PaymentSuccessPage";
import PaymentFailPage from "@/pages/payment/PaymentFailPage";


// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PaymentComponent from "@/pages/payment/PaymentComponent";
import StripePaymentFailPage from "@/pages/payment/stripe/StripePaymentFailPage";
import StripePaymentSuccessPage from "@/pages/payment/stripe/StripePaymentSuccessPage";
import VNPayPaymentFailPage from "@/pages/payment/vnpay/VNPayPaymentFailPage";
import VNPayPaymentSuccessPage from "@/pages/payment/vnpay/VNPayPaymentSuccessPage";

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* Public routes accessible to all users */}
			<Route element={<PublicLayout />}>
				<Route path={Path.root.path} element={<WelcomePage />} />
				<Route path={Path.about.path} element={<AboutPage />} />
				<Route path={Path.vnpayPaymentSuccess.path} element={<VNPayPaymentSuccessPage />} />
				<Route path={Path.vnpayPaymentFail.path} element={<VNPayPaymentFailPage />} />
				<Route path={Path.stripePaymentSuccess.path} element={<StripePaymentSuccessPage />} />
				<Route path={Path.stripePaymentFail.path} element={<StripePaymentFailPage />} />
			</Route>

			{/* Authentication routes for unauthenticated users */}
			<Route element={<PublicRoute />}>
				<Route path={Path.login.path} element={<LoginPage />} />
				<Route path={Path.register.path} element={<RegisterPage />} />
				<Route
					path={Path.forgotPassword.path}
					element={<ForgotPasswordPage />}
				/>
				<Route
					path={Path.resetPassword.path}
					element={<ResetPasswordPage />}
				/>
			</Route>

			{/* Protected routes for authenticated users */}
			<Route element={<ProtectedRoute />}>
				<Route element={<NavigationLayout />}>
					<Route
						path={Path.user.outlets.dashboard.path}
						element={<DashboardPage />}
					/>
					<Route path={Path.user.outlets.profile.path} element={<ProfilePage />} />
					<Route path={Path.forum.path} element={<ForumPage />} />
					<Route path={Path.payment.path} element={<PaymentPage />} />
				</Route>
			</Route>

			{/* Fallback for any other route */}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

export default AppRoutes;
