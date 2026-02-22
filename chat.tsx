import { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:8000/chat", {
      message: message,
    });

    setChat([...chat, "You: " + message, "AI: " + res.data.reply]);
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-xl p-4">
      <div className="h-60 overflow-y-auto">
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>
      <input
        className="border w-full p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white w-full mt-2 p-2 rounded">
        Ask Resume
      </button>
    </div>
  );
};

export default Chat;