import { useState } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        AI
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            Resume AI
            <span onClick={() => setOpen(false)}>✕</span>
          </div>
          <div className="chat-body">
            <p>Ask about skills, experience or projects.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;