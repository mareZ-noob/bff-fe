import React from "react";

const AboutPage: React.FC = () => {
	return (
		<div className="py-16">
			<div className="container mx-auto px-6 text-gray-700">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
						About Our Platform
					</h1>

					<div className="space-y-12">
						<section>
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Our Mission
							</h2>
							<p className="text-lg leading-relaxed">
								Our mission is to democratize access to cutting-edge artificial
								intelligence. We believe in building intuitive and powerful
								tools that empower users to leverage AI for creativity,
								productivity, and innovation without needing a technical
								background.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								What We Do
							</h2>
							<p className="text-lg leading-relaxed mb-4">
								This platform provides a robust environment for user management
								and direct interaction with an advanced AI assistant. Key
								features include:
							</p>
							<ul className="list-disc list-inside space-y-2 text-lg">
								<li>Secure user authentication and profile management.</li>
								<li>
									An interactive chat interface for asking the AI questions.
								</li>
								<li>
									Conversation history to keep track of your interactions.
								</li>
								<li>
									A scalable architecture ready for future AI integrations.
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-gray-800 mb-4">
								Our Vision
							</h2>
							<p className="text-lg leading-relaxed">
								We envision a future where AI is an accessible and indispensable
								partner in daily tasks and complex problem-solving. We are
								committed to continuously improving our platform, ensuring it
								remains at the forefront of AI technology while prioritizing
								user privacy and data security.
							</p>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
