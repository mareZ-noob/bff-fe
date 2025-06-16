import React, {
	createContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface AuthenticatedUser {
	username: string;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: AuthenticatedUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<AuthenticatedUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const response = await fetch("/authentication");
				if (response.ok) {
					const data = await response.json();
					setIsAuthenticated(data.isAuthenticated);
					setUser(data.authenticatedUser);
				} else {
					setIsAuthenticated(false);
					setUser(null);
				}
			} catch (error) {
				console.error("Failed to check authentication status", error);
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	// OIDC handles login/logout redirects, so we just need to provide the state.
	// In more complex flows, you might have login/logout functions here.

	return (
		<AuthContext.Provider value={{ isAuthenticated, isLoading, user }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
