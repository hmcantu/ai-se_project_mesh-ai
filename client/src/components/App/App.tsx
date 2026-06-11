import { Routes, Route } from "react-router-dom";
import AppLayout from "../AppLayout/AppLayout";
import KnowledgeBase from "../../pages/KnowledgeBase/KnowledgeBase";
import Intro from "../../pages/Intro/Intro";
import ChatBox from "../../components/ChatBox/ChatBox";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route element={<AppLayout />}>
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route 
            path="/chat" 
            element={
              <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", padding: "40px 16px" }}>
                <ChatBox />
              </div>
            } 
          />
        </Route>
      </Routes>
    </div>
  );
}