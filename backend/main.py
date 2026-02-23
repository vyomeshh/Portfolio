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

# ===============================
# FastAPI App Setup
# ===============================
app = FastAPI()

# Enable CORS so React (Vercel) can communicate with this Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# Vyomesh's Real Resume Data
# ===============================
resume_data = {
    "name": "Vyomesh Mishra",
    "role": "Computer Science Undergraduate & Software Developer",
    "education": "B.Tech Computer Science & Engineering at Galgotias University (2023-2027). Class XII (89.4%) and Class X (93.6%) from Lucknow Public School.",
    "contact": "Email: mishravyomesh14@gmail.com | Phone: (+91) 7651950803 | LinkedIn: linkedin.com/in/vyomesh-mishra | GitHub: github.com/vyomeshh",
    "skills": [
        "Python (Expert)", "Java", "C++", "C", "JavaScript",
        "Data Structures and Algorithms (DSA)", "Object-Oriented Programming (OOP)", 
        "MySQL", "Operating Systems", "Distributed Systems", "Git/GitHub"
    ],
    "experience": [
        "Google Data Analytics Intern (2024): Architected data pipelines and advanced visualizations.",
        "Technical Mentor at HCL GUVI (Apr-Aug 2025): Mentored students on Python and programming logic.",
        "Club Coordinator at Galgotias Tech Council (2023-Present): Directed coding events and technical initiatives."
    ],
    "projects": [
        "AI-Driven Smart File Assistant: Intelligent document querying using Python, NLP, and Machine Learning.",
        "Student Score Predictor: ML regression model using Scikit-Learn and Pandas.",
        "Hospital Management System: Secure Java/SQL application with an HTML/JS frontend.",
        "Cloudinfo Weather App: Real-time weather tracking using Python, PyQt5, and OpenWeatherMap API."
    ],
    "achievements": [
        "LeetCode Contest Rating: 1589 (Top 15% globally)",
        "Google Analytics Certification",
        "Tata GenAI Powered Data Analytics Job Simulation",
        "GUVI Python & Java DSA Certified"
    ]
}

# ===============================
# API Endpoints
# ===============================
@app.get("/resume-data")
def get_resume():
    return resume_data

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    if not OPENROUTER_API_KEY:
        return {"reply": "Error: OpenRouter API key not configured in backend."}

    context = f"""
    You are the professional AI assistant for {resume_data['name']}'s portfolio.
    Answer recruiter questions based ONLY on the provided data. Be concise.
    
    CANDIDATE INFO:
    - Name: {resume_data['name']}
    - Role: {resume_data['role']}
    - Education: {resume_data['education']}
    - Contact: {resume_data['contact']}
    
    SKILLS: {', '.join(resume_data['skills'])}
    
    EXPERIENCE: 
    {chr(10).join(resume_data['experience'])}
    
    PROJECTS:
    {chr(10).join(resume_data['projects'])}
    
    ACHIEVEMENTS:
    {chr(10).join(resume_data['achievements'])}
    """

    try:
        # We combine the system prompt and user prompt into one message to bypass strict OpenRouter 400 errors
        combined_prompt = f"{context}\n\nUSER QUESTION:\n{request.message}"

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/vyomeshh", 
                "X-Title": "Vyomesh AI Portfolio"
            },
            json={
                "model": "google/gemini-2.0-flash-lite-preview-02-05:free", # Highly reliable free model
                "messages": [
                    {"role": "user", "content": combined_prompt}
                ]
            }
        )
        
        # If OpenRouter rejects it, return the exact error directly to the chat bubble!
        if response.status_code != 200:
            print(f"OPENROUTER EXACT ERROR: {response.text}", flush=True)
            return {"reply": f"OpenRouter rejected the request. Code: {response.status_code}. Details: {response.text}"}
            
        data = response.json()

        if "choices" in data and len(data["choices"]) > 0:
            reply = data["choices"][0]["message"]["content"]
        else:
            reply = "I connected to the AI, but it didn't return a message!"

        return {"reply": reply}

    except Exception as e:
        print(f"Backend Crash: {e}", flush=True)
        return {"reply": f"The Python backend crashed! Error: {str(e)}"}
