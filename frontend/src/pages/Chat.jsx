import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import io from "socket.io-client";
import { MdDone, MdDoneAll } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

function Chat() {
  const { conversationId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const socket = io("http://localhost:5000");

    socket.emit("joinConversation", conversationId);

    const fetchMessages = async () => {
      const res = await api.get(`/chat/messages/${conversationId}`);
      setMessages(res.data);
    };

    fetchMessages();

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // listen for seen events
    socket.on("messageSeen", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m._id) ? { ...m, seen: true } : m))
      );
    });

    // store socket on ref so send() can access it
    socketRef.current = socket;

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSeen");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const res = await api.post(`/chat/messages`, {
      conversationId,
      senderId: user._id,
      content: input,
    });

    setMessages((prev) => [...prev, res.data]);
    if (socketRef.current) socketRef.current.emit("sendMessage", { conversationId, message: res.data });
    setInput("");
  };

  // mark messages as seen when opening the conversation
  useEffect(() => {
    if (!conversationId || !user?._id) return;

    const markSeen = async () => {
      try {
        const res = await api.patch(`/chat/messages/${conversationId}/seen`, { userId: user._id });
        const { messageIds } = res.data;
        if (messageIds && messageIds.length) {
          setMessages((prev) => prev.map((m) => (messageIds.includes(m._id) ? { ...m, seen: true } : m)));
        }
      } catch (err) {
        // ignore
      }
    };

    markSeen();
  }, [conversationId, user?._id]);

  const otherName = messages.find((m) => m.sender._id !== user._id)?.sender?.name || "Chat";

  return (
    <div style={chatPage}>
      <div style={chatHeader}>
        <Link to="/matches" style={backLink}><FaArrowLeft /></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={headerAvatar}>{otherName.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
          <div>
            <div style={{ fontWeight: 800, color: "#fff" }}>{otherName}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Available · Last seen recently</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, maxWidth: "820px", width: "100%" }}>
        <div style={{ padding: "18px", borderRadius: 14, background: "linear-gradient(180deg,#020617,#040714)", minHeight: 320 }}>
          {messages.map((m) => {
            const isMine = m.sender._id === user._id;
            const time = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={m._id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 12 }}>
                {!isMine && (
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#0b1220", color: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, fontSize: 13, fontWeight: 800 }}>
                    {m.sender.name?.split(" ")?.map((n) => n[0])?.slice(0, 2).join("")}
                  </div>
                )}

                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                  <div style={{ background: isMine ? "linear-gradient(90deg,#6b7280,#9ca3af)" : "#0b0f12", padding: "12px 16px", borderRadius: 16, color: "#fff", boxShadow: "0 6px 18px rgba(2,6,23,0.35)", wordBreak: "break-word" }}>
                    {m.content}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
                    <div>{time}</div>
                    {isMine && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {!m.seen && <MdDone style={{ color: "#94a3b8" }} />}
                        {m.seen && <MdDoneAll style={{ color: "#34d399" }} />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={composer}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message..." style={composerInput} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
          <button onClick={send} style={composerButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;

const chatPage = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(180deg,#020617,#000)",
};

const chatHeader = {
  width: "100%",
  maxWidth: 820,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 14px",
  borderRadius: 12,
  background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
  border: "1px solid rgba(255,255,255,0.04)",
};

const backLink = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: 18,
  marginRight: 8,
};

const headerAvatar = {
  width: 48,
  height: 48,
  borderRadius: 12,
  background: "linear-gradient(135deg,#475569,#9ca3af)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
};

const composer = {
  display: "flex",
  gap: 10,
  marginTop: 16,
  maxWidth: 820,
  width: "100%",
};

const composerInput = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 12,
  background: "#071127",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.03)",
  outline: "none",
};

const composerButton = {
  padding: "12px 16px",
  borderRadius: 12,
  background: "linear-gradient(90deg,#6b7280,#9ca3af)",
  color: "#071029",
  border: "none",
  cursor: "pointer",
  fontWeight: 800,
};