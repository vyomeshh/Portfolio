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

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    # Strictly use OpenRouter API - No Fake Fallbacks
    if not OPENROUTER_API_KEY:
        return {"reply": "Error: OPENROUTER_API_KEY is missing in the Render Environment Variables."}

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://portfolio-vyomesh.vercel.app" # Required by OpenRouter
            },
            json={
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free", # Highly reliable free model
                "messages": [
                    {"role": "system", "content": f"You are Vyomesh's AI assistant. Answer questions concisely using ONLY this info: {resume_data}"},
                    {"role": "user", "content": request.message}
                ]
            },
            timeout=30 # INCREASED TIMEOUT: Free models can take up to 15-20 seconds to reply!
        )
        
        if response.status_code == 200:
            data = response.json()
            return {"reply": data["choices"][0]["message"]["content"]}
        else:
            # If OpenRouter rejects it, return the exact HTTP error to the frontend
            return {"reply": f"OpenRouter API Error {response.status_code}: {response.text}"}

    except requests.exceptions.Timeout:
        return {"reply": "OpenRouter API timed out after 30 seconds. The free model server is currently overloaded."}
    except Exception as e:
        return {"reply": f"Backend Crash: {str(e)}"}
