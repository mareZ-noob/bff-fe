import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Path } from "@/utils/path";
import { useThemeStore } from "@/hooks/useThemeStore";
import { Sun, Moon } from "lucide-react";

const Navbar: React.FC = () => {
	const { user } = useAuth();
	const { theme, toggleTheme } = useThemeStore();

	const navLinkClasses = "hover:text-blue-600 dark:hover:text-blue-400";
	const activeNavLinkClasses = "text-blue-600 dark:text-blue-400 font-semibold";
	const inactiveNavLinkClasses = "text-gray-600 dark:text-gray-300";

	return (
		<header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900 transition-colors duration-300">
			<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
				<Link
					to={Path.root.path}
					className="text-2xl font-bold text-gray-800 hover:text-blue-600 dark:text-white"
				>
					AI Platform
				</Link>

				<div className="hidden md:flex items-center space-x-8">
					<NavLink
						to={Path.root.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						Home
					</NavLink>
					<NavLink
						to={Path.user.outlets.dashboard.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						Dashboard
					</NavLink>
					<NavLink
						to={Path.user.outlets.profile.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						Profile
					</NavLink>
					<NavLink
						to={Path.about.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						About
					</NavLink>
					<NavLink
						to={Path.forum.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						Forum
					</NavLink>
					<NavLink
						to={Path.payment.path}
						className={({ isActive }) =>
							`${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`
						}
					>
						Payment
					</NavLink>
				</div>

				<div className="flex items-center space-x-4">
					<button
						onClick={toggleTheme}
						className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
						aria-label="Toggle theme"
					>
						{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
					</button>
					{user ? (
						<>
							<span className="text-gray-700 font-medium dark:text-gray-200">
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
							to={Path.login.path}
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
