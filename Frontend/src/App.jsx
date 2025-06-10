import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search?q=${query}`);
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Add this function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear results and reset search state when input is empty or only whitespace
    if (value.trim() === "") {
      setResults([]);
      setSearched(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Smart Chat History Search
        </h1>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
            placeholder="Search for a word..."
            value={query}
            onChange={handleInputChange} // Changed this line
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((msg, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white to-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                dangerouslySetInnerHTML={{
                  __html: query.trim() ? (msg || "").replace(
                    new RegExp(`(${query.trim()})`, "gi"),
                    "<mark class='bg-gradient-to-r from-yellow-200 to-yellow-300 px-1 rounded'>$1</mark>"
                  ) : (msg || "")
                }}
              />
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-400">No messages found</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-gray-400">Start searching your chat history</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;