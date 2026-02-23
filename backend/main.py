from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

# ===============================
# Load Environment Variables
# ===============================
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

# Enable CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resume_data = {
    "name": "Vyomesh Mishra",
    "role": "Computer Science Undergraduate & Software Developer",
    "education": "B.Tech Computer Science & Engineering at Galgotias University (2023-2027).",
    "contact": "Email: mishravyomesh14@gmail.com | LinkedIn: linkedin.com/in/vyomesh-mishra",
    "skills": ["Python", "Java", "C++", "DSA", "OOP", "MySQL", "Git/GitHub"],
    "experience": [
        "Google Data Analytics Intern (2024)",
        "Technical Mentor at HCL GUVI (Apr-Aug 2025)",
        "Club Coordinator at Galgotias Tech Council (2023-Present)"
    ],
    "projects": [
        "AI-Driven Smart File Assistant",
        "Student Score Predictor",
        "Hospital Management System",
        "Cloudinfo Weather App"
    ]
}

@app.get("/resume-data")
def get_resume():
    return resume_data

class ChatRequest(BaseModel):
    message: str

# --- THE SMART FALLBACK LOGIC ---
# If OpenRouter fails, this function analyzes the user's message and returns the perfect response
def get_fallback_response(user_message: str) -> str:
    msg = user_message.lower()
    if "experience" in msg or "intern" in msg or "work" in msg:
        return "Vyomesh was a Google Data Analytics Intern (2024) and a Technical Mentor at HCL GUVI. He also coordinates events at the Galgotias Tech Council!"
    elif "skill" in msg or "tech" in msg or "language" in msg:
        return f"Vyomesh is an expert in {', '.join(resume_data['skills'])}. He also has strong fundamentals in DSA and OOP."
    elif "project" in msg or "build" in msg or "made" in msg:
        return "His top projects include an AI-Driven Smart File Assistant, a Student Score Predictor, and a full Hospital Management System in Java!"
    elif "education" in msg or "college" in msg or "study" in msg:
        return "He is currently pursuing his B.Tech in Computer Science & Engineering at Galgotias University (Class of 2027)."
    elif "contact" in msg or "email" in msg or "hire" in msg or "reach" in msg:
        return "You can reach him directly at mishravyomesh14@gmail.com or connect with him on LinkedIn!"
    elif "hi" in msg or "hello" in msg or "hey" in msg:
        return "Hi there! I am Vyomesh's AI Assistant. You can ask me about his skills, experience, projects, or education."
    else:
        return "I am a smart assistant programmed with Vyomesh's resume! Try asking me about his 'projects', 'skills', or 'experience'."

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    # 1. Try OpenRouter First
    try:
        if not OPENROUTER_API_KEY:
            raise ValueError("No API Key")

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://portfolio-vyomesh.vercel.app"
            },
            json={
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": [
                    {"role": "system", "content": f"You are Vyomesh's AI assistant. Answer using this info: {resume_data}"},
                    {"role": "user", "content": request.message}
                ]
            },
            timeout=5 # Don't let it hang forever
        )
        
        if response.status_code == 200:
            data = response.json()
            return {"reply": data["choices"][0]["message"]["content"]}
        else:
            raise ValueError(f"OpenRouter rejected with {response.status_code}")

    # 2. If OpenRouter crashes, gets a 400/401 error, or times out -> Trigger Smart Fallback!
    except Exception as e:
        print(f"API Failed ({e}). Using Local Smart Fallback instead.", flush=True)
        fallback_reply = get_fallback_response(request.message)
        return {"reply": fallback_reply}
