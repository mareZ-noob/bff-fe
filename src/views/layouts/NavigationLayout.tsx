import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NavigationLayout: React.FC = () => {
	return (
		<div className="bg-gray-100 dark:bg-gray-900">
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow container mx-auto px-6 py-8">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default NavigationLayout;
