import { useState, useEffect } from "react";
import { uploadImageAndGetStyle } from "./services/api";
import ImageUploader from "./components/ImageUploader";
import ResultDisplay from "./components/ResultDisplay";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const loadingMessages = [
    "Analyzing fabric texture…",
    "Matching colors with trends…",
    "Stitching style ideas…",
    "Adding glam…",
    "Almost there…",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      let percent = 0;
      const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 10) + 5;
        setProgress((prev) => Math.min(percent, 100));

        if (percent >= 100) {
          clearInterval(interval);
        }

        // Change loading message every 20%
        setCurrentMessageIndex(Math.floor(percent / 30));
      }, 600);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setCurrentMessageIndex(0);
    }
  }, [loading]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadImageAndGetStyle(file);
      setResult(result.imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/60 shadow-2xl rounded-3xl p-8 w-full max-w-xl text-center"
      >
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">AI Fashion Stylist</h1>
        <p className="text-gray-700 mb-6">Upload an outfit and get stylized looks for Office, Party, and Vacation!</p>

        <ImageUploader preview={preview} handleFileChange={handleFileChange} />

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Style"}
        </button>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 w-full"
            >
              <motion.div
                className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.4 }}
                  className="h-full bg-blue-600"
                />
              </motion.div>
              <div className="text-blue-700 font-medium text-sm mb-2">{progress}%</div>
              <div className="text-sm text-gray-600 italic">
                {loadingMessages[currentMessageIndex] || "Finalizing..."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {result && <ResultDisplay result={result} />}
      </motion.div>
    </div>
  );
}
