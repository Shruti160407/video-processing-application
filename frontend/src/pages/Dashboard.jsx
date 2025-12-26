import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";

function Dashboard() {
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const payload = JSON.parse(atob(token.split(".")[1]));
const role = payload.role;


  useEffect(() => {
    // ✅ fetch videos
    const fetchVideos = async () => {
      try {
        const res = await api.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();

    // 🔔 real-time video status updates
    socket.on("video-updated", (data) => {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
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

    // 🧹 cleanup on unmount
    return () => {
      socket.off("video-updated");
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      
      {role !== "viewer" && (
      <button onClick={() => navigate("/upload")}>
        Upload Video
      </button>
    )}
    
      <button onClick={handleLogout}>Logout</button>

      <h3>My Videos</h3>

      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul>
          {videos.map((video) => (
  <li key={video._id}>
    <strong>{video.originalName}</strong> —{" "}
    {video.status} —{" "}
    {video.sensitivity || "Analyzing..."}

    {video.status === "completed" && (
      <div>
        <video width="400" controls>
          <source
            src={`http://localhost:5000/videos/stream/${video.filename}`}
            type="video/mp4"
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
