import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import TextEditor from "@/common/components/TextEditor";
import { Send } from "lucide-react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
	username: string;
	content: string;
	timestamp: string;
}

const ForumPage: React.FC = () => {
	const { user } = useAuth();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [messageContent, setMessageContent] = useState("");
	const [isConnecting, setIsConnecting] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const stompClient = useRef<Client | null>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const client = new Client({
			webSocketFactory: () => new SockJS("/websocket/ws"),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				console.log("Connected via STOMP");
				setIsConnecting(false);

				client.subscribe("/topic/public", (message: IMessage) => {
					const receivedMessage: ChatMessage = JSON.parse(message.body);
					setMessages((prevMessages) => [...prevMessages, receivedMessage]);
				});
			},
			onStompError: (frame) => {
				console.error("Broker reported error: " + frame.headers["message"]);
				console.error("Additional details: " + frame.body);
				setError("An error occurred with the message broker.");
				setIsConnecting(false);
			},
			onWebSocketError: (event) => {
				console.error("WebSocket error:", event);
				setError("Could not connect to the chat server.");
				setIsConnecting(false);
			},
			onWebSocketClose: () => {
				console.log("WebSocket connection closed.");
				// The STOMP client will attempt to reconnect automatically.
			},
		});

		client.activate();
		stompClient.current = client;

		return () => {
			if (stompClient.current) {
				stompClient.current.deactivate();
			}
		};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (messageContent.trim() && stompClient.current?.connected) {
			if (user) {
				const chatMessage = {
					username: user.username,
					content: messageContent,
					timestamp: new Date().toISOString(),
				};
				stompClient.current.publish({
					destination: "/app/chat.sendMessage",
					body: JSON.stringify(chatMessage),
				});
				setMessageContent("");
			} else {
				setError("You must be logged in to chat.");
			}
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-150px)] rounded-lg shadow-md">
			<h1 className="text-2xl font-bold text-gray-800 p-4 border-b">
				Community Forum
			</h1>

			<div className="flex-grow p-4 overflow-y-auto">
				{isConnecting && (
					<div className="text-center text-gray-500">Connecting to chat...</div>
				)}
				{error && (
					<div className="text-center text-red-500 p-4 bg-red-100 rounded-md">
						{error}
					</div>
				)}
				{!isConnecting && !error && messages.length === 0 && (
					<div className="text-center text-gray-500">
						Welcome to the forum! Be the first to send a message.
					</div>
				)}

				<div className="space-y-4">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex items-start gap-3 ${msg.username === user?.username ? "flex-row-reverse" : ""}`}
						>
							<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
								{msg.username.charAt(0).toUpperCase()}
							</div>
							<div
								className={`p-3 rounded-lg max-w-[70%] ${msg.username === user?.username ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
							>
								<div className="font-bold text-sm">{msg.username}</div>
								<div
									className="text-base"
									dangerouslySetInnerHTML={{ __html: msg.content }}
								></div>
								<div className="text-xs opacity-75 mt-1">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</div>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className="p-4 border-t">
				<form onSubmit={handleSendMessage} className="flex items-center gap-3">
					<div className="flex-grow">
						<TextEditor
							field="message"
							labelText=""
							setValue={setMessageContent}
							defaultValue={messageContent}
						/>
					</div>
					<button
						type="submit"
						disabled={!messageContent.trim() || !stompClient.current?.connected}
						className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
					>
						<Send size={20} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForumPage;
