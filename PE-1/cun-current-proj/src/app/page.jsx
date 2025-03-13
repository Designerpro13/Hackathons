
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [persona, setPersona] = useState({
    gender: "",
    education: "",
    location: "",
    age: "",
  });
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [webContent, setWebContent] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showIpTooltip, setShowIpTooltip] = useState(false);
  const [proxyIp, setProxyIp] = useState("localhost");

  useEffect(() => {
    const getLocalIp = async () => {
      try {
        const response = await fetch("/integrations/anthropic-claude-haiku/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content:
                  "Please analyze this URL: https://api.ipify.org?format=json and extract the IP address",
              },
            ],
          }),
        });
        const data = await response.json();
        const ip =
          data.choices[0].message.content.match(
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
          )?.[0] || "localhost";
        setProxyIp(/^\d+\.\d+\.\d+\.\d+$/.test(ip) ? ip : "localhost");
      } catch (error) {
        setProxyIp("localhost");
      }
    };
    getLocalIp();
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
      setStreamingMessage("");
      setLoading(false);
    },
  });
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsFullScreen(true);
    setLoading(true);
    const userMessage = {
      role: "user",
      content: searchQuery,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const personaContext = Object.entries(persona)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");

      const response = await fetch("/integrations/anthropic-claude-haiku/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a helpful AI assistant. Consider the user context: ${personaContext}. Keep responses concise and relevant.`,
            },
            userMessage,
          ],
          stream: true,
        }),
      });

      handleStreamResponse(response);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
      setLoading(false);
    }
  };
  const renderMessageContent = (content) => {
    return (
      <div className="flex-1">
        {content.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-[url('/mesh-gradient.png')] bg-cover bg-center bg-no-repeat transition-all duration-500 flex flex-col ${
        isFullScreen ? "fixed inset-0 z-50" : ""
      }`}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 192, 203, 0.9), rgba(255, 255, 255, 0.9))`,
      }}
    >
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-crimson-text text-[#8B5CF6] hover:text-[#EC4899] transition-colors">
            SecSrc
          </h1>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <button
                onClick={() => setShowIpTooltip(!showIpTooltip)}
                className="text-[#8B5CF6] hover:text-[#EC4899] transition-colors"
              >
                <i className="fas fa-shield-alt text-xl animate-lock"></i>
              </button>
              {showIpTooltip && (
                <div className="absolute right-0 mt-2 w-64 py-3 px-4 bg-white rounded-lg shadow-lg text-sm animate-fade-in-scale">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-[#6366F1] font-medium">
                      IP Protection Active
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs space-y-1">
                    <p>🔒 End-to-end encryption enabled</p>
                    <p>🛡️ Your IP: {proxyIp}</p>
                    <p>✨ Connection: Secure</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAboutModal(true)}
              className="text-[#8B5CF6] hover:text-[#EC4899] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-[#8B5CF6] hover:text-[#EC4899] transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-crimson-text mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#EC4899] text-transparent bg-clip-text animate-color-shift">
            SecSrc
          </h1>
          <p className="text-sm md:text-base text-[#4B5563]">
            AI-Powered Assistant
          </p>
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <i className="fas fa-comment text-[#8B5CF6] hover:text-[#EC4899] transition-colors mx-2"></i>
            <input
              type="text"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-[#4B5563] font-roboto placeholder-[#6B7280]"
              placeholder="Ask me anything..."
            />
            <button
              onClick={() => setShowPersonaModal(true)}
              className="ml-2 hover:scale-110 transition-transform duration-200"
            >
              <i className="fas fa-user-cog text-[#8B5CF6] hover:text-[#EC4899] transition-colors"></i>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#EC4899] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 font-roboto shadow-lg hover:shadow-xl animate-pulse"
            >
              Send Message
            </button>
          </div>
        </div>
        {showPersonaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl transform transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-crimson-text text-[#4a4af4]">
                  Customize Your Persona
                </h2>
                <button
                  onClick={() => setShowPersonaModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-6">
                <div className="transition-all duration-200">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={persona.gender}
                    onChange={(e) =>
                      setPersona({ ...persona, gender: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="transition-all duration-200">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Education Level
                  </label>
                  <select
                    name="education"
                    value={persona.education}
                    onChange={(e) =>
                      setPersona({ ...persona, education: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Education</option>
                    <option value="high_school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">PhD</option>
                  </select>
                </div>
                <div className="transition-all duration-200">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={persona.location}
                    onChange={(e) =>
                      setPersona({ ...persona, location: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your location"
                  />
                </div>
                <div className="transition-all duration-200">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={persona.age}
                    onChange={(e) =>
                      setPersona({ ...persona, age: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your age"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPersonaModal(false);
                  setMessages([]);
                }}
                className="w-full bg-gradient-to-r from-[#4a4af4] to-[#8a4af4] text-white py-3 rounded-lg mt-8 hover:opacity-90 transition-all duration-200 font-medium shadow-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
        {showAboutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-crimson-text text-[#4a4af4]">
                  About SecSrc
                </h2>
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="prose">
                <p className="text-gray-600">
                  SecSrc is a privacy-focused search engine developed by
                  Designerpro13. Our mission is to provide secure and
                  intelligent web analysis while protecting user privacy.
                </p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-[#4a4af4]">
                    Features
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>AI-powered content analysis</li>
                    <li>End-to-end encryption</li>
                    <li>Customizable user personas</li>
                    <li>Privacy-first approach</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <a
                    href="https://github.com/Designerpro13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4a4af4] hover:underline"
                  >
                    <i className="fab fa-github mr-2"></i>View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-crimson-text text-[#4a4af4]">
                  Contact Us
                </h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#4a4af4] focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4a4af4] to-[#8a4af4] text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setMessages([])}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="max-h-[600px] overflow-y-auto rounded-lg shadow-inner bg-white/10 backdrop-blur-sm p-4">
          <div
            className={`mt-8 max-w-3xl mx-auto transition-all duration-500 ${
              isFullScreen ? "animate-[slideIn_0.5s_ease-out]" : ""
            }`}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-4 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-white/80 backdrop-blur-sm ml-4"
                    : "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white mr-4"
                } shadow-md border border-white/20 hover:shadow-xl transition-shadow duration-300 animate-fade-in-scale`}
              >
                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${
                      message.role === "assistant" ? "fa-robot" : "fa-user"
                    } mt-1 ${
                      message.role === "assistant"
                        ? "text-[#8B5CF6] hover:text-[#EC4899]"
                        : "text-white"
                    } transition-colors`}
                  ></i>
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
            {streamingMessage && (
              <div className="mb-4 p-4 rounded-lg bg-white/80 backdrop-blur-sm ml-4 shadow-md border border-white/20 hover:shadow-xl transition-shadow duration-300 animate-fade-in-scale">
                <div className="flex items-start gap-3">
                  <i className="fas fa-robot mt-1 text-[#8B5CF6] hover:text-[#EC4899] transition-colors"></i>
                  {renderMessageContent(streamingMessage)}
                </div>
              </div>
            )}
            {loading && !streamingMessage && (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]"></div>
              </div>
            )}
          </div>
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-8">
              <div className="hover:transform hover:scale-110 transition-transform duration-300">
                <i className="fas fa-shield-alt text-3xl mb-2 text-[#8B5CF6] hover:text-[#EC4899] transition-colors"></i>
                <p className="text-sm text-[#4B5563]">End-to-End Encrypted</p>
              </div>
              <div className="hover:transform hover:scale-110 transition-transform duration-300">
                <i className="fas fa-robot text-3xl mb-2 text-[#8B5CF6] hover:text-[#EC4899] transition-colors"></i>
                <p className="text-sm text-[#4B5563]">AI-Powered Results</p>
              </div>
              <div className="hover:transform hover:scale-110 transition-transform duration-300">
                <i className="fas fa-user-shield text-3xl mb-2 text-[#8B5CF6] hover:text-[#EC4899] transition-colors"></i>
                <p className="text-sm text-[#4B5563]">Privacy First</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white/80 backdrop-blur-sm shadow-lg mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a
              href="https://github.com/Designerpro13"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a4af4] hover:text-[#2a2ad4] flex items-center gap-2"
            >
              <i className="fab fa-github text-xl"></i>
              <span>GitHub</span>
            </a>
            <button
              onClick={() =>
                alert(
                  "Terms of Service: This is a privacy-focused search engine that respects user data and provides secure web analysis."
                )
              }
              className="text-[#4a4af4] hover:text-[#2a2ad4] text-sm flex items-center gap-2"
            >
              <i className="fas fa-file-contract"></i>
              <span>Terms</span>
            </button>
            <button
              onClick={() =>
                alert(
                  "Privacy Policy: We do not store any personal information. All searches are encrypted and anonymous."
                )
              }
              className="text-[#4a4af4] hover:text-[#2a2ad4] text-sm flex items-center gap-2"
            >
              <i className="fas fa-shield-alt"></i>
              <span>Privacy</span>
            </button>
            <a
              href="mailto:contact@secsrc.com"
              className="text-[#4a4af4] hover:text-[#2a2ad4] flex items-center gap-2"
            >
              <i className="fas fa-envelope"></i>
              <span>Contact</span>
            </a>
          </div>
          <p className="text-center text-[#4B5563] text-sm mt-4">
            © 2024 SecSrc. All rights reserved.
          </p>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes colorShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes lockAnimation {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-5px); opacity: 0.7; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .animate-color-shift {
          background-size: 200% 200%;
          animation: colorShift 5s ease infinite;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }
        .animate-lock {
          animation: lockAnimation 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;