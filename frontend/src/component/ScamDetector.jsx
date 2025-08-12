import { useState } from "react";
import axios from "axios";

export default function ScamDetector() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkScam = async () => {
    if (!inputText.trim()) return alert("Please enter text or a link");
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/check-scam", { text: inputText });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Error checking scam." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center text-gray-900 p-6">
      <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 w-[650px]">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          🛡 AI Scam & Phishing Detector
        </h2>
        <p className="text-gray-600 mb-6">
          Paste any suspicious link, email, or message below to check for scams.
        </p>

        <textarea
          className="w-full p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Paste link or message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          className="mt-4 w-full py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg font-semibold"
          onClick={checkScam}
          disabled={loading}
        >
          {loading ? "Scanning..." : "🔍 Check Now"}
        </button>

        {result && (
          <div
            className={`mt-6 p-4 rounded-lg text-lg font-semibold shadow-md ${
              result.status === "High Risk"
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-green-100 border border-green-400 text-green-700"
            }`}
          >
            {result.error && <p className="text-yellow-600">{result.error}</p>}
            {!result.error && (
              <>
                <p>{result.status}</p>
                <p className="text-sm mt-2 opacity-80">{result.reason}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
