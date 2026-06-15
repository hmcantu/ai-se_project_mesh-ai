import { useState, useEffect } from "react";
import { getChats, createChat, type Chat as ChatType } from "../../utils/api";
import "./Chat.css";
import plusIcon from "../../assets/plus.png";

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load conversations.");
      } finally {
        setIsLoadingChats(false);
      }
    };
    load();
  }, []);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";
    setIsCreatingChat(false);
    setNewChatTitle("");

    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
      }
    } catch {
      setChatsError("Failed to create chat.");
    }
  };

  return (
    <div className="chat">
      <aside className="chat__sidebar">
        <button 
          className="chat__new-btn" 
          type="button"
          onClick={() => setIsCreatingChat(true)}
        >
          <div className="chat__new-btn-content">
            <img src={plusIcon} alt="" className="chat__plus-icon" />
            <span className="chat__new-btn-text">New Chat</span>
          </div>
        </button>

        {isCreatingChat && (
          <input
            className="chat__title-input"
            type="text"
            placeholder="Chat name"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateChat();
              if (e.key === "Escape") {
                setIsCreatingChat(false);
                setNewChatTitle("");
              }
            }}
            autoFocus
          />
        )}

        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <ul className="chat__list">
          {chats.map((c) => (
            <li
              key={c._id}
              className={
                c._id === activeChatId
                  ? "chat__item chat__item_active"
                  : "chat__item"
              }
              onClick={() => setActiveChatId(c._id)}
            >
              {c.title}
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat__main">
        {!activeChatId ? (
          <div className="chat__prompt-container">
            <h2 className="chat__prompt-text">
              Create a new chat or select an existing chat to start the conversation
            </h2>
            <button 
              className="chat__prompt-btn" 
              type="button"
              onClick={() => setIsCreatingChat(true)}
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="chat__workspace">
            <div className="chat__input-container">
              <textarea 
                className="chat__textarea" 
                placeholder="Ask any question"
                rows={1}
              />
              <button className="chat__send-btn" type="button" aria-label="Send message">
                <svg className="chat__send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}