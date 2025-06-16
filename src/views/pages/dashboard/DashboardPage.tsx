import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Bot, MessageSquare, Send } from "lucide-react";

// --- Re-declaring interfaces here for a self-contained component ---
interface AiQaFormData {
	prompt: string;
}

interface AiQaResponseMessage {
	role: "user" | "assistant";
	content: string;
}

const DashboardPage: React.FC = () => {
	const { user } = useAuth();
	const [aiQaForm, setAiQaForm] = useState<AiQaFormData>({ prompt: "" });
	const [aiConversation, setAiConversation] = useState<AiQaResponseMessage[]>(
		[],
	);
	const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
	const [aiError, setAiError] = useState<string>("");

	const handleAiInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAiQaForm({ prompt: e.target.value });
	};

	const handleAiSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const prompt = aiQaForm.prompt.trim();
		if (!prompt) return;

		setIsLoadingAi(true);
		setAiError("");

		// Add user's message to conversation immediately for better UX
		setAiConversation((prev) => [...prev, { role: "user", content: prompt }]);
		setAiQaForm({ prompt: "" });

		const requestBody = {
			prompt,
			conversation_history: aiConversation,
		};

		try {
			const response = await fetch("/api/ai/qa/ask", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(requestBody),
			});

			const data = await response.json();

			if (response.ok) {
				setAiConversation((prev) => [
					...prev,
					{ role: "assistant", content: data.answer },
				]);
			} else {
				setAiError(
					data.detail || "An error occurred while fetching the AI response.",
				);
				// Optional: remove the user's last message if the API call failed
				setAiConversation((prev) => prev.slice(0, -1));
			}
		} catch (error) {
			console.error("AI Q&A error:", error);
			setAiError("Network error or AI service is unavailable.");
			setAiConversation((prev) => prev.slice(0, -1));
		} finally {
			setIsLoadingAi(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
				<p className="text-gray-600">Welcome back, {user?.username}!</p>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
					<div className="p-3 bg-blue-100 rounded-full">
						<Bot size={24} className="text-blue-600" />
					</div>
					<div>
						<p className="text-sm text-gray-500">AI Status</p>
						<p className="text-xl font-semibold text-gray-800">Online</p>
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
					<div className="p-3 bg-green-100 rounded-full">
						<MessageSquare size={24} className="text-green-600" />
					</div>
					<div>
						<p className="text-sm text-gray-500">Total Queries</p>
						<p className="text-xl font-semibold text-gray-800">
							{aiConversation.filter((m) => m.role === "user").length}
						</p>
					</div>
				</div>
			</div>

			{/* AI Assistant Section */}
			<div className="bg-white rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-700 p-6 border-b">
					AI Assistant
				</h2>
				<div className="p-6">
					<div className="h-96 bg-gray-50 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto">
						{aiConversation.length === 0 && !isLoadingAi && (
							<div className="flex-grow flex items-center justify-center text-gray-500">
								Your conversation will appear here.
							</div>
						)}
						{aiConversation.map((msg, index) => (
							<div
								key={index}
								className={`p-3 rounded-lg max-w-[85%] ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"}`}
							>
								<p className="text-sm">{msg.content}</p>
							</div>
						))}
						{isLoadingAi && (
							<div className="self-start">
								<div className="p-3 rounded-lg bg-gray-200 text-gray-800 flex items-center">
									<span className="animate-pulse">Thinking...</span>
								</div>
							</div>
						)}
					</div>

					{aiError && (
						<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
							{aiError}
						</div>
					)}

					<form
						onSubmit={handleAiSubmit}
						className="mt-4 flex items-center space-x-3"
					>
						<textarea
							value={aiQaForm.prompt}
							onChange={handleAiInputChange}
							placeholder="Ask the AI anything..."
							className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
							rows={1}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleAiSubmit(e);
								}
							}}
						/>
						<button
							type="submit"
							disabled={isLoadingAi}
							className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
						>
							<Send size={20} />
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
