import AppRoutes from "./routes/AppRoutes";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-react";
import { ReactPlugin } from "@21st-extension/react";

const App: React.FC = () => {
	return (
		<div>
			<TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
			<AppRoutes />
		</div>
	);
};

export default App;
