import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdCode } from "react-icons/md";

import api from "../api";

function Matches() {
  const [matches, setMatches] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/match/${user._id}`);
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };

    if (user?._id) {
      fetchMatches();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "40px", color: "#e5e7eb" }}>
        <p>Please register first.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(180deg, #020617, #000)",
        color: "#e5e7eb",
      }}
    >
      <h2 style={{ color: "#e0e7ff", marginBottom: "6px" }}>
        Your Matches
      </h2>
      <p style={{ opacity: 0.8 }}>
        People who complement your skills
      </p>

      {matches.length === 0 ? (
        <div
          style={{
            marginTop: "60px",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          <h3>No teammates found yet 🚀</h3>
          <p style={{ marginTop: "10px" }}>
            New users will appear here automatically.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {matches.map((m) => (
            <div
              key={m._id}
              style={{
                background: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(18px)",
                borderRadius: "18px",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 0 25px rgba(99,102,241,0.15)",
              }}
            >
              {/* Name */}
              <h3 style={{ color: "#e0e7ff", marginBottom: "6px" }}>
                {m.name}
              </h3>

              {/* Skills */}
              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                <strong>Skills:</strong> {m.skills.join(", ")}
              </p>

              {/* Profiles */}
              <div
  style={{
    display: "flex",
    gap: "16px",
    marginTop: "14px",
    alignItems: "center",
  }}
>
  {m.portfolio?.github && (
    <a
      href={m.portfolio.github}
      target="_blank"
      rel="noreferrer"
      title="GitHub"
      style={{
        color: "#e5e7eb",
        fontSize: "22px",
        transition: "transform 0.2s ease",
      }}
    >
      <FaGithub />
    </a>
  )}

  {m.portfolio?.linkedin && (
    <a
      href={m.portfolio.linkedin}
      target="_blank"
      rel="noreferrer"
      title="LinkedIn"
      style={{
        color: "#0a66c2",
        fontSize: "22px",
        transition: "transform 0.2s ease",
      }}
    >
      <FaLinkedin />
    </a>
  )}

  {m.portfolio?.codingProfile && (
    <a
      href={m.portfolio.codingProfile}
      target="_blank"
      rel="noreferrer"
      title="Coding Profile"
      style={{
        color: "#34d399",
        fontSize: "22px",
        transition: "transform 0.2s ease",
      }}
    >
      <MdCode />
    </a>
  )}
</div>


              {/* Action */}
              <button
                onClick={async () => {
                  await api.post("/requests", {
                    fromUser: user._id,
                    toUser: m._id,
                  });
                  alert("Team request sent!");
                }}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "10px",
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Team Up
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
