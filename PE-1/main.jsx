function MainComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [persona, setPersona] = useState({
      gender: "",
      education: "",
      location: "",
      age: "",
    });
    const [showPersonaModal, setShowPersonaModal] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const [searchResults, setSearchResults] = useState("");
    const handleFinish = useCallback((message) => {
      setSearchResults(message);
      setStreamingMessage("");
    }, []);
    const handleStreamResponse = useHandleStreamResponse({
      onChunk: setStreamingMessage,
      onFinish: handleFinish,
    });
  
    const handleSearch = async () => {
      const response = await fetch("/integrations/anthropic-claude-sonnet-3-5/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Search query: ${searchQuery}\nPersona: ${JSON.stringify(persona)}`,
            },
          ],
          stream: true,
        }),
      });
      handleStreamResponse(response);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#f0f0ff]">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-crimson-text text-[#4a4af4]">
              SecureAI Search
            </h1>
            <div className="flex gap-4">
              <a href="#" className="text-[#4a4af4] hover:text-[#2a2ad4]">
                About
              </a>
              <a href="#" className="text-[#4a4af4] hover:text-[#2a2ad4]">
                Contact
              </a>
            </div>
          </div>
        </nav>
  
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-crimson-text mb-4 bg-gradient-to-r from-[#4a4af4] to-[#8a4af4] text-transparent bg-clip-text">
              SecureAI Search
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              End-to-End Encrypted · Zero Training Policy · Persona-Based Results
            </p>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-center bg-white rounded-lg p-3 mb-4 shadow-lg">
              <i className="fas fa-search text-[#4a4af4] mx-2"></i>
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-gray-800 font-roboto"
                placeholder="Enter your search query..."
              />
              <button onClick={() => setShowPersonaModal(true)} className="ml-2">
                <i className="fas fa-user-cog text-[#4a4af4]"></i>
              </button>
            </div>
  
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-[#4a4af4] to-[#8a4af4] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-roboto shadow-lg"
              >
                Search Securely
              </button>
            </div>
          </div>
  
          {showPersonaModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-crimson-text">
                    Customize Your Persona
                  </h2>
                  <button onClick={() => setShowPersonaModal(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
  
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm">Gender</label>
                    <select
                      name="gender"
                      value={persona.gender}
                      onChange={(e) =>
                        setPersona({ ...persona, gender: e.target.value })
                      }
                      className="w-full bg-[#0a0a1f] rounded p-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Education Level</label>
                    <select
                      name="education"
                      value={persona.education}
                      onChange={(e) =>
                        setPersona({ ...persona, education: e.target.value })
                      }
                      className="w-full bg-[#0a0a1f] rounded p-2"
                    >
                      <option value="">Select Education</option>
                      <option value="high_school">High School</option>
                      <option value="bachelors">Bachelor's Degree</option>
                      <option value="masters">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={persona.location}
                      onChange={(e) =>
                        setPersona({ ...persona, location: e.target.value })
                      }
                      className="w-full bg-[#0a0a1f] rounded p-2"
                      placeholder="Enter your location"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={persona.age}
                      onChange={(e) =>
                        setPersona({ ...persona, age: e.target.value })
                      }
                      className="w-full bg-[#0a0a1f] rounded p-2"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
  
                <button
                  onClick={() => setShowPersonaModal(false)}
                  className="w-full bg-[#00ff94] text-[#0a0a1f] py-2 rounded-lg mt-6 hover:bg-[#00cc75] transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
  
          {streamingMessage && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow">
              <p className="text-gray-800">{streamingMessage}</p>
            </div>
          )}
  
          {searchResults && !streamingMessage && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow">
              <p className="text-gray-800">{searchResults}</p>
            </div>
          )}
  
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-8">
              <div>
                <i className="fas fa-shield-alt text-3xl mb-2"></i>
                <p className="text-sm text-[#7a7a8c]">End-to-End Encrypted</p>
              </div>
              <div>
                <i className="fas fa-robot text-3xl mb-2"></i>
                <p className="text-sm text-[#7a7a8c]">AI-Powered Results</p>
              </div>
              <div>
                <i className="fas fa-user-shield text-3xl mb-2"></i>
                <p className="text-sm text-[#7a7a8c]">Privacy First</p>
              </div>
            </div>
          </div>
        </div>
  
        <footer className="bg-[#4a4af4] text-white mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-crimson-text text-xl mb-4">
                  SecureAI Search
                </h3>
                <p className="text-sm">
                  Privacy-first search engine powered by AI
                </p>
              </div>
              <div>
                <h4 className="font-crimson-text text-lg mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-gray-200">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-200">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-crimson-text text-lg mb-4">Connect</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gray-200">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-gray-200">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="hover:text-gray-200">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  
  