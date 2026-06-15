import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getChats, createChat, getChat, type Chat as ChatType, type Message } from "../../utils/api";
import "./Chat.css";
import plusIcon from "../../assets/plus.png";
import errorIcon from "../../assets/error.png";

export default function Chat() {
  // Sidebar State Blocks
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>("");

  // Load sidebar chats on mount
  useEffect(() => {
    const loadSidebar = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load conversations.");
      } finally {
        setIsLoadingChats(false);
      }
    };
    loadSidebar();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const loadMessages = async () => {
      setMessages([]);
      setIsLoadingMessages(true);
      setMessagesError("");
      try {
        const res = await getChat(activeChatId!);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Failed to load messages.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeChatId]);

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
        <button className="chat__new-btn" type="button" onClick={() => setIsCreatingChat(true)}>
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
              className={c._id === activeChatId ? "chat__item chat__item_active" : "chat__item"}
              onClick={() => setActiveChatId(c._id)}
            >
              {c.title}
            </li>
          ))}
        </ul>
      </aside>
      <div className="chat__main">
        
        {/* State A: No Selected Active Conversation Thread */}
        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-messages">
            <h2 className="chat__prompt-text">
              Create a new chat or select an existing chat to start the conversation
            </h2>
            <button className="chat__prompt-btn" type="button" onClick={() => setIsCreatingChat(true)}>
              Start New Chat
            </button>
          </div>
        )}

        {/* State B: Chat Selected, but contains No Historical Messages */}
        {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
          <div className="chat__no-messages">
            <h2 className="chat__prompt-text">Ask a question below to start the conversation</h2>
          </div>
        )}

        {/* State C: Loading Active Thread Data Payload */}
        {activeChatId && isLoadingMessages && (
          <p className="chat__sidebar-message chat__message-loading">Loading messages…</p>
        )}

        {/* State D: Catch-all Fallback Chat Loading Error Boundary */}
        {activeChatId && messagesError && (
          <div className="chat__error-container">
            <div className="chat__error-icon-box">
              <img src={errorIcon} alt="Error" className="chat__error-icon" />
            </div>
            
            <div className="chat__error-text-block">
              <h2 className="chat__error-title">Looks like something went wrong</h2>
              <p className="chat__error-message">Try reloading the page or creating the chat again</p>
            </div>

            <button 
              className="chat__error-button" 
              type="button"
              onClick={() => window.location.reload()}
            >
              Go to the Main Page
            </button>
          </div>
        )}

        {/* State E: Main Render Engine with Active Message Arrays */}
        {activeChatId && !isLoadingMessages && !messagesError && messages.length > 0 && (
          <ul className="chat__messages">
            {messages.map((msg) => (
              <li
                key={msg._id}
                className={
                  msg.role === "user"
                    ? "chat__message chat__message_user"
                    : "chat__message chat__message_assistant"
                }
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}