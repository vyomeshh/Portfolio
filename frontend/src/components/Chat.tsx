import { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!message) return;

    const res = await axios.post("http://127.0.0.1:8000/chat", {
      message,
    });

    setChat([...chat, "You: " + message, "AI: " + res.data.reply]);
    setMessage("");
  };

  return (
    <div className="chat">
      <h2>Ask My Resume 🤖</h2>
      <div className="messages">
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about my experience..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;