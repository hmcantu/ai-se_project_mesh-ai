import ChatBox from "../../components/ChatBox/ChatBox";
import "./ChatPage.css"; 

export default function ChatPage() {
  return (
    <div className="chat-page">
      <main className="chat-page__main-content">
        <ChatBox />
      </main>
    </div>
  );
}