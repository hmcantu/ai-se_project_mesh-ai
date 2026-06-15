import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useOutletContext } from "react-router-dom";
import { getChats, createChat, getChat, sendMessage, type Chat as ChatType, type Message } from "../../utils/api";
import "./Chat.css";
import plusIcon from "../../assets/plus.png";
import errorIcon from "../../assets/error.png";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

export default function Chat() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext<MobileContext>();

  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>("");

  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

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

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await sendMessage(activeChatId, text);
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch {
      const errorMessage: Message = {
        _id: Date.now().toString(),
        chatId: activeChatId,
        role: "assistant",
        content: "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";
    setIsCreatingChat(false);
    setNewChatTitle("");

    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prev) => [res.data!, ...prev]);
        setActiveChatId(res.data._id);
        setIsMobileMenuOpen(false);
      }
    } catch {
      setChatsError("Failed to create chat.");
    }
  };

  return (
    <div className="chat">
      <aside className={`chat__sidebar ${isMobileMenuOpen ? "chat__sidebar_open" : ""}`}>
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
              onClick={() => {
                setActiveChatId(c._id);
                setIsMobileMenuOpen(false);
              }}
            >
              {c.title}
            </li>
          ))}
        </ul>
      </aside>

      <div className="chat__main">
        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-chats-frame">
            <h2 className="chat__prompt-text">
              Create a new chat or select an existing chat to start the conversation
            </h2>
            <button
              className="chat__prompt-btn"
              type="button"
              onClick={() => {
                setIsCreatingChat(true);
                setIsMobileMenuOpen(true);
              }}
            >
              Start New Chat
            </button>
          </div>
        )}

        {activeChatId && isLoadingMessages && (
          <p className="chat__sidebar-message chat__message-loading">Loading messages…</p>
        )}

        {activeChatId && messagesError && (
          <div className="chat__error-container">
            <div className="chat__error-icon-box">
              <img src={errorIcon} alt="Error" className="chat__error-icon" />
            </div>
            <div className="chat__error-text-block">
              <h2 className="chat__error-title">Looks like something went wrong</h2>
              <p className="chat__error-message">Try reloading the page or creating the chat again</p>
            </div>
            <button className="chat__error-button" type="button" onClick={() => window.location.reload()}>
              Go to the Main Page
            </button>
          </div>
        )}

        {activeChatId && !isLoadingMessages && !messagesError && (
          <div className={`chat__workspace-container ${messages.length === 0 ? "chat__workspace-container_empty" : ""}`}>
            
            {messages.length === 0 ? (
              <div className="chat__no-messages">
                <h2 className="chat__prompt-text">Ask a question below to start the conversation</h2>
              </div>
            ) : (
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

            <div className="chat__footer">
              <div className="chat__input-bar">
                <textarea
                  className="chat__input"
                  placeholder="Ask any question"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                />
                <button
                  className="chat__send"
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                >
                  <svg className="chat__send-vector" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}