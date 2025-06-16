import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";

// This interface matches the CustomerVm record from your Spring Boot backend
interface CustomerProfile {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
}

const ProfilePage: React.FC = () => {
	const [profile, setProfile] = useState<CustomerProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				// This endpoint is automatically proxied by Vite to your BFF
				const response = await fetch("/api/customer/customer/profile", {
					credentials: "include", // Important for sending session cookies
				});

				if (response.ok) {
					const data: CustomerProfile = await response.json();
					setProfile(data);
				} else if (response.status === 403) {
					setError(
						"Access Denied: You do not have permission to view this profile.",
					);
				} else {
					setError(`An error occurred: ${response.statusText}`);
				}
			} catch (err) {
				setError("Failed to connect to the server. Please try again later.");
				console.error("Fetch profile error:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, []); // Empty dependency array ensures this runs only once on component mount

	// --- Render Loading State ---
	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-8 text-center">
				<Loader2 className="animate-spin mr-3" size={24} />
				<p className="text-gray-600">Loading Profile...</p>
			</div>
		);
	}

	// --- Render Error State ---
	if (error) {
		return (
			<div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto flex items-center">
				<AlertTriangle className="mr-4" size={32} />
				<div>
					<h2 className="font-bold text-lg">Error</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	// --- Render Profile ---
	if (!profile) {
		return null; // Or a "Profile not found" message
	}

	return (
		<div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-start gap-8">
				{/* Avatar Section */}
				<div className="flex-shrink-0 mx-auto md:mx-0">
					<img
						className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md"
						// Using a dynamic avatar service based on the user's name
						src={`https://api.dicebear.com/8.x/initials/svg?seed=${profile.firstName} ${profile.lastName}`}
						alt="Profile Avatar"
					/>
				</div>

				{/* Details Section */}
				<div className="text-center md:text-left flex-grow">
					<h1 className="text-4xl font-bold text-gray-800">
						{profile.firstName} {profile.lastName}
					</h1>
					<p className="text-lg text-gray-500 mt-1">@{profile.username}</p>

					<div className="mt-8 pt-6 border-t w-full">
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							Contact Information
						</h2>
						<div className="space-y-4 text-gray-600">
							<div className="flex items-center">
								<Mail size={20} className="mr-3 text-blue-500" />
								<span>{profile.email}</span>
							</div>
						</div>
					</div>

					<div className="mt-6 pt-6 border-t w-full">
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							Account Details
						</h2>
						<div className="space-y-4 text-gray-600">
							<div className="flex items-center">
								<User size={20} className="mr-3 text-blue-500" />
								<span>User ID: {profile.id}</span>
							</div>
							<div className="flex items-center">
								<ShieldCheck size={20} className="mr-3 text-blue-500" />
								<span>Role: Standard User</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
