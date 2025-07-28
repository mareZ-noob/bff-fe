import React from "react";
import { Link } from "react-router-dom";
import { Path } from "@/utils/path";

const Footer: React.FC = () => {
	return (
		<footer className="border-t mt-auto">
			<div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
				<p className="text-gray-600 text-sm">
					&copy; {new Date().getFullYear()} AI Platform. All rights reserved.
				</p>
				<div className="flex space-x-6 mt-4 md:mt-0">
					<Link
						to={Path.about.path}
						className="text-gray-600 hover:text-blue-600 text-sm"
					>
						About Us
					</Link>
					<Link to="#" className="text-gray-600 hover:text-blue-600 text-sm">
						Privacy Policy
					</Link>
					<Link to="#" className="text-gray-600 hover:text-blue-600 text-sm">
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
