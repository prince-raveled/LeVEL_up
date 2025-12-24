import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MatchIntro from "./pages/MatchIntro";
import Matches from "./pages/Matches";
import RequestPage from "./pages/RequestPage";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/intro" element={<MatchIntro />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="/request/:token" element={<RequestPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
