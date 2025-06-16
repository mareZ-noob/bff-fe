// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import "./styles/index.css";
import "./styles/TextEditor.css";

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<BrowserRouter>
		<ThemeProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ThemeProvider>
	</BrowserRouter>,
	// </StrictMode>,
);
