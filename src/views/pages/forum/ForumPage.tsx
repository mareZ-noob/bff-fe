import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import TextEditor from "@/common/components/TextEditor";
import { Send } from "lucide-react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ChatMessage {
	sender: string;
	content: string;
	type: "CHAT" | "JOIN" | "LEAVE";
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
		if (!user) {
			setIsConnecting(false);
			setError("You must be logged in to connect to the chat.");
			return;
		}
		console.log("User is authenticated, attempting to connect to WebSocket...");

		const client = new Client({
			webSocketFactory: () => new SockJS("/api/websocket/ws"),
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			onConnect: () => {
				console.log("Connected via STOMP");
				setIsConnecting(false);
				setError(null);

				// Subscribe to the correct topic '/topic/messages'
				client.subscribe("/topic/messages", (message: IMessage) => {
					const receivedMessage: ChatMessage = JSON.parse(message.body);
					setMessages((prevMessages) => [...prevMessages, receivedMessage]);
				});

				// Announce that the user has joined the chat
				client.publish({
					destination: "/app/chat.addUser",
					body: JSON.stringify({
						sender: user.username,
						type: "JOIN",
						content: `${user.username} has joined!`,
					}),
				});
			},
			onStompError: (frame) => {
				const errorMessage = frame.headers["message"] || "An error occurred with the message broker.";
				console.error("Broker reported error: " + errorMessage);
				console.error("Additional details: " + frame.body);
				setError(errorMessage);
				setIsConnecting(false);
			},
			onWebSocketError: (event) => {
				console.error("WebSocket error:", event);
				setError("Could not connect to the chat server. Is the backend running?");
				setIsConnecting(false);
			},
		});

		client.activate();
		stompClient.current = client;

		return () => {
			if (stompClient.current?.connected) {
				// Announce that the user is leaving
				stompClient.current.publish({
					destination: "/app/chat.sendMessage",
					body: JSON.stringify({
						sender: user.username,
						type: 'LEAVE',
						content: `${user.username} has left.`
					})
				});
				stompClient.current.deactivate();
				console.log("WebSocket client deactivated.");
			}
		};
	}, [user]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const submitMessage = () => {
		if (messageContent.trim() && stompClient.current?.connected && user) {
			const chatMessage = {
				sender: user.username,
				content: messageContent,
				type: "CHAT",
			};

			stompClient.current.publish({
				destination: "/app/chat.sendMessage",
				body: JSON.stringify(chatMessage),
			});

			setMessageContent("");
		} else if (!user) {
			setError("You must be logged in to send a message.");
		}
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		submitMessage();
	};

	const renderMessage = (msg: ChatMessage, index: number) => {
		if (msg.type === "JOIN" || msg.type === "LEAVE") {
			return (
				<div key={index} className="text-center text-sm text-gray-500 py-2">
					{msg.content}
				</div>
			);
		}

		const isMyMessage = msg.sender === user?.username;
		return (
			<div
				key={index}
				className={`flex items-start gap-3 ${isMyMessage ? "flex-row-reverse" : ""}`}
			>
				<div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
					{msg.sender.charAt(0).toUpperCase()}
				</div>
				<div
					className={`p-3 rounded-lg max-w-[70%] ${isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
				>
					<div className="font-bold text-sm">{msg.sender}</div>
					<div
						className="prose-content"
						dangerouslySetInnerHTML={{ __html: msg.content }}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-150px)] rounded-lg shadow-md">
			<h1 className="text-2xl font-bold text-gray-800 p-4 border-b">
				Community Forum
			</h1>

			<div className="flex-grow p-4 overflow-y-auto">
				{isConnecting && <div className="text-center text-gray-500">Connecting to chat...</div>}
				{error && <div className="text-center text-red-500 p-4 bg-red-100 rounded-md">{error}</div>}
				{!isConnecting && !error && messages.length === 0 && (
					<div className="text-center text-gray-500">
						Welcome to the forum! Be the first to send a message.
					</div>
				)}

				<div className="space-y-4">
					{messages.map(renderMessage)}
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
							value={messageContent}
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
