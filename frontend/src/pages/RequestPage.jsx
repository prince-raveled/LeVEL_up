import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function RequestPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 🔐 Login compulsory
    if (!user) {
      navigate(`/login?redirect=/request/${token}`);
      return;
    }

    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/token/${token}`);
        setRequest(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load request"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        Loading request...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        {error}
      </div>
    );
  }

  if (!request) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #000)",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(15, 23, 42, 0.7)",
          padding: "30px",
          borderRadius: "18px",
          width: "380px",
          textAlign: "center",
          backdropFilter: "blur(16px)",
        }}
      >
        <h2 style={{ color: "#e0e7ff" }}>
          {request.fromUser.name} wants to collaborate 🚀
        </h2>

        <p style={{ marginTop: "10px", fontSize: "14px", opacity: 0.85 }}>
          Skills: {request.fromUser.skills.join(", ")}
        </p>

        <div style={{ marginTop: "22px" }}>
          <button
            onClick={async () => {
              await api.patch(`/requests/${request._id}`, {
                status: "accepted",
              });
              navigate("/matches");
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "#22c55e",
              border: "none",
              borderRadius: "10px",
              color: "#000",
              fontWeight: "700",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            Accept
          </button>

          <button
            onClick={async () => {
              await api.patch(`/requests/${request._id}`, {
                status: "rejected",
              });
              navigate("/matches");
            }}
            style={{
              width: "100%",
              padding: "10px",
              background: "#ef4444",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
