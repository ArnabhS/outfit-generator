export default function ImageUploader({ preview, handleFileChange }) {
    return (
      <div className="flex flex-col items-center">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-xl mb-4 shadow-lg border border-gray-200"
          />
        )}
        <label className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition">
          Upload Image
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    );
  }
  