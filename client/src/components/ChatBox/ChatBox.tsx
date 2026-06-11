import React, { useState } from "react";
import "./ChatBox.css";
import chatSendIcon from "../../assets/ChatSend.png";

export default function ChatBox() {
  const [query, setQuery] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Chat stream handling logic will go here
    setQuery("");
  };

  return (
    <div className="chat-box">
      <h2 className="chat-box__intro-text">
        Ask a question below <br /> to start the conversation
      </h2>

      <form className="chat-box__input-container" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-box__input"
          placeholder="Ask any question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="chat-box__send-btn" aria-label="Send query">
          <img src={chatSendIcon} alt="" className="chat-box__send-icon" />
        </button>
      </form>
    </div>
  );
}