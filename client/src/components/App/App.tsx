import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../AppLayout/AppLayout";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Intro from "../../pages/Intro/Intro";
import Chat from "../../pages/Chat/Chat";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import { ProtectedRoute, PublicRoute } from "../ProtectedRoute/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public-only routes (redirects to /knowledge if already logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Public landing page accessible to anyone */}
        <Route path="/" element={<Intro />} />

        {/* Protected workspace routes (redirects to /login if token is missing/expired) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>

        {/* Global fallback: if user types an unknown URL, bounce them home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}