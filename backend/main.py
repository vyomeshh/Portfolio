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

# Enable CORS so React can communicate with this backend
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

    # Highly optimized System Prompt to make the AI act like a real assistant
    context = f"""
    You are the official, professional AI assistant for {resume_data['name']}'s portfolio website.
    Your goal is to answer recruiter and visitor questions about Vyomesh based ONLY on the provided data.
    Be friendly, concise, and highly professional. Highlight his strengths. Do not invent or hallucinate any information.
    
    CANDIDATE INFORMATION:
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
    
    INSTRUCTIONS:
    - Keep answers under 3-4 short sentences unless asked for details.
    - If asked for contact info, provide the email and LinkedIn.
    - If you don't know the answer based on the data above, politely state that they should contact Vyomesh directly for more details.
    """

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                # You can change this to a free model like "mistralai/mistral-7b-instruct:free" or "google/gemini-2.0-flash-lite-preview-02-05:free" if your credits run out
                "model": "openai/gpt-3.5-turbo", 
                "messages": [
                    {"role": "system", "content": context},
                    {"role": "user", "content": request.message}
                ]
            }
        )
        
        response.raise_for_status() # Raise an exception for bad status codes
        data = response.json()

        if "choices" in data and len(data["choices"]) > 0:
            reply = data["choices"][0]["message"]["content"]
        else:
            print("Unexpected API response:", data)
            reply = "I'm having a little trouble connecting to my AI brain right now. Please try again in a moment!"

        return {"reply": reply}

    except Exception as e:
        print(f"Backend Error: {e}")
        return {"reply": "Sorry, I am currently offline. Please ensure the backend server has internet access and a valid OpenRouter API key."}