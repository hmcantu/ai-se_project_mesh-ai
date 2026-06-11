import { Routes, Route } from "react-router-dom";
import AppLayout from "../AppLayout/AppLayout";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Intro from "../../pages/Intro/Intro";
import "./App.css";

function ChatPlaceholder() {
  return (
    <div style={{ padding: "40px 16px", maxWidth: "670px", margin: "0 auto" }}>
      <h2>Chat Component Placeholder</h2>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route element={<AppLayout />}>
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/chat" element={<ChatPlaceholder />} />
        </Route>
      </Routes>
    </div>
  );
}