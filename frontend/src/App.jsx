import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load pages for better performance
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const MatchIntro = lazy(() => import("./pages/MatchIntro"));
const Matches = lazy(() => import("./pages/Matches"));
const RequestPage = lazy(() => import("./pages/RequestPage"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/intro" element={<MatchIntro />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:conversationId" element={<Chat />} />
          <Route path="/request/:token" element={<RequestPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
