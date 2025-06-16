import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Path } from "@/utils/path";

const Navbar: React.FC = () => {
	const { user } = useAuth();

	const activeLinkStyle = {
		color: "#2563EB",
		fontWeight: 600,
	};

	return (
		<header className="shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
				<Link
					to={Path.root.index}
					className="text-2xl font-bold text-gray-800 hover:text-blue-600"
				>
					AI Platform
				</Link>

				<div className="hidden md:flex items-center space-x-8">
					<NavLink
						to={Path.root.index}
						style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
						className="text-gray-600 hover:text-blue-600"
					>
						Home
					</NavLink>
					<NavLink
						to={Path.user.outlets.dashboard}
						style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
						className="text-gray-600 hover:text-blue-600"
					>
						Dashboard
					</NavLink>
					<NavLink
						to={Path.user.outlets.profile}
						style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
						className="text-gray-600 hover:text-blue-600"
					>
						Profile
					</NavLink>
					<NavLink
						to={Path.about.index}
						style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
						className="text-gray-600 hover:text-blue-600"
					>
						About
					</NavLink>
					<NavLink
						to={Path.forum.index}
						style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
						className="text-gray-600 hover:text-blue-600"
					>
						Forum
					</NavLink>
				</div>

				<div className="flex items-center space-x-4">
					{user ? (
						<>
							<span className="text-gray-700 font-medium">
								Welcome, {user.username}
							</span>
							<form action="/logout" method="post">
								<button
									type="submit"
									className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								>
									Logout
								</button>
							</form>
						</>
					) : (
						<Link
							to={Path.login.index}
							className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Login
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
