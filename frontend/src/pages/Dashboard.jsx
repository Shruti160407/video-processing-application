import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";

function Dashboard() {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  //  decode role from JWT
  let role = "viewer";

if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    role = payload.role || "viewer";
  } catch (err) {
    console.error("Invalid token", err);
  }
}


  //  fetch videos +  socket updates
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();

    socket.on("video-updated", (data) => {
      setVideos((prev) =>
        prev.map((video) =>
          video._id === data.videoId
            ? {
                ...video,
                status: data.status,
                sensitivity: data.sensitivity,
              }
            : video
        )
      );
    });

    return () => {
      socket.off("video-updated");
    };
  }, []);

  // 🎥 upload handler
  const handleUpload = async () => {
    if (!file) return alert("Please select a video");

    const formData = new FormData();
    formData.append("video", file);

    try {
      setMessage("");
      await api.post("/videos/upload", formData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setMessage("Upload successful ");
      setProgress(0);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed ");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      
      <p><strong>Role:</strong> {role}</p>

      <button onClick={handleLogout}>Logout</button>

      {/* 🔐 UPLOAD SECTION (Editor/Admin only) */}
      {role !== "viewer" && (
        <div style={{ marginTop: "20px", marginBottom: "30px" }}>
          <h3>Upload Video</h3>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br />

          <button onClick={handleUpload} style={{ marginTop: "10px" }}>
            Upload
          </button>

          {progress > 0 && <p>Uploading: {progress}%</p>}
          {message && <p>{message}</p>}
        </div>
      )}

      {/* VIDEO LIST */}
      <h3>My Videos</h3>

      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video._id} style={{ marginBottom: "30px" }}>
              <strong>{video.originalName}</strong> —{" "}
              {video.status} —{" "}
              {video.sensitivity || "Analyzing..."}

              {video.status === "completed" && (
                <div style={{ marginTop: "10px" }}>
                  <video width="400" controls preload="metadata">
                    <source
                      src={`http://localhost:5000/videos/stream/${video.filename}`}
                    />
                  </video>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
