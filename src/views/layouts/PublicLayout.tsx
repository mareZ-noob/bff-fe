import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout: React.FC = () => {
	return (
		<div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
};

export default PublicLayout;
