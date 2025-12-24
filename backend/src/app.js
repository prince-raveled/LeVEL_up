const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});
const userRoutes = require("./routes/user.routes");
const matchRoutes = require("./routes/match.routes");
const requestRoutes = require("./routes/request.routes");
const authRoutes = require("./routes/auth.routes");
const chatRoutes = require("./routes/chat.routes");

app.use("/api/auth", authRoutes);


app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);


module.exports = app;
