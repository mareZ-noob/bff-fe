import React from "react";
import { Link } from "react-router-dom";
import { Path } from "@/utils/path";

const WelcomePage: React.FC = () => {
	return (
		<div>
			<div className="container mx-auto px-6 py-24 text-center">
				<h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
					Welcome to the Future of AI
				</h1>
				<p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
					Our platform provides a seamless interface to interact with a powerful
					AI assistant, manage your profile, and explore a new world of
					possibilities.
				</p>
				<div className="mt-10 flex justify-center gap-4">
					<Link
						to={Path.login.path}
						className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
					>
						Get Started
					</Link>
					<Link
						to={Path.about.path}
						className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
					>
						Learn More
					</Link>
				</div>
			</div>
		</div>
	);
};

export default WelcomePage;
