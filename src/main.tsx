// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import "./styles/index.css";
import "./styles/TextEditor.css";
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18n.ts";

createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<BrowserRouter>
		<ThemeProvider>
			<AuthProvider>
				<I18nextProvider i18n={i18n}>
					<App />
				</I18nextProvider>
			</AuthProvider>
		</ThemeProvider>
	</BrowserRouter>,
	// </StrictMode>,
);
