import { useState } from "react";
import api from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return alert("Select a video");

    const formData = new FormData();
    formData.append("video", file);

    try {
      await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      alert("Upload successful");
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload</button>

      {progress > 0 && <p>Uploading: {progress}%</p>}
    </div>
  );
}

export default Upload;
