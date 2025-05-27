import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
        const res = await fetch(`https://smartchathistory.onrender.com/search?q=${query}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Smart Chat History Search
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded"
            placeholder="Search for a word..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded border border-gray-200"
                dangerouslySetInnerHTML={{
                  __html: msg.replace(
                    new RegExp(`(${query})`, "gi"),
                    "<mark class='bg-yellow-200'>$1</mark>"
                  ),
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No messages found</p>
        )}
      </div>
    </div>
  );
}

export default App;
