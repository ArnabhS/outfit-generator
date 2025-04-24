export default function ResultDisplay({ result }) {
  return (
    <div className="mt-8 text-left space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">Your Personalized Styles</h2>
      {["Office", "Party", "Vacation"].map((occasion) => (
        <div key={occasion} className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">{occasion} Look</h3>
          <img
            src={result[occasion]}
            alt={`${occasion} style`}
            className="w-full h-auto rounded-lg mb-3"
          />
          <a
            href={result[occasion]}
            download={`${occasion.toLowerCase()}-style.png`}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
