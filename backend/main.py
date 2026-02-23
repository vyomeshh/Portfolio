from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests
import random

# ===============================
# Load Environment Variables
# ===============================
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

# Enable CORS for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your Central Data Source
resume_data = {
    "name": "Vyomesh Mishra",
    "role": "Computer Science Undergraduate & Software Developer",
    "education": "B.Tech Computer Science & Engineering at Galgotias University (2023-2027). Class XII (89.4%) and Class X (93.6%) from Lucknow Public School.",
    "contact": "Email: mishravyomesh14@gmail.com | LinkedIn: linkedin.com/in/vyomesh-mishra",
    "skills": ["Python (Expert)", "Java", "C++", "DSA", "OOP", "MySQL", "Git/GitHub"],
    "experience": [
        "Google Data Analytics Intern (2024)",
        "Technical Mentor at HCL GUVI (Apr-Aug 2025)",
        "Club Coordinator at Galgotias Tech Council (2023-Present)"
    ],
    "projects": [
        "AI-Driven Smart File Assistant (NLP & ML)",
        "Student Score Predictor (Scikit-Learn)",
        "Hospital Management System (Java & SQL)",
        "Cloudinfo Weather App (PyQt5 & APIs)"
    ]
}

class ChatRequest(BaseModel):
    message: str

def get_local_response(user_query: str) -> str:
    query = user_query.lower()
    if any(word in query for word in ["project", "build", "made"]):
        return f"Vyomesh has developed several impressive projects, including an {resume_data['projects'][0]} and a {resume_data['projects'][1]}."
    if any(word in query for word in ["skill", "language", "tech", "stack"]):
        return f"Vyomesh is proficient in {', '.join(resume_data['skills'])}. He has a strong grasp of Data Structures and Algorithms."
    if any(word in query for word in ["experience", "work", "intern", "job"]):
        return f"His professional experience includes a {resume_data['experience'][0]} and serving as a {resume_data['experience'][1]}."
    if any(word in query for word in ["education", "college", "study", "university"]):
        return f"Vyomesh is currently pursuing his {resume_data['education']}."
    if any(word in query for word in ["contact", "email", "linkedin", "reach", "hire"]):
        return f"You can reach Vyomesh at {resume_data['contact']}."
    return "Vyomesh is a dedicated Software Developer with expertise in Python and Java. Feel free to ask about his projects, skills, or experience!"

# --- DYNAMIC MODEL SCANNER ---
def get_available_free_models():
    """Queries OpenRouter to find currently active free models."""
    try:
        response = requests.get("https://openrouter.ai/api/v1/models", timeout=5)
        if response.status_code == 200:
            all_models = response.json().get('data', [])
            # Filter for models that contain ':free' in their ID
            free_models = [m['id'] for m in all_models if ':free' in m['id']]
            # Shuffle so we don't always hit the same first model (spreads the load)
            random.shuffle(free_models)
            return free_models[:5] # Return top 5 candidates
    except Exception as e:
        print(f"Scanner Error: {e}")
    # Fallback list if scanner fails
    return ["google/gemini-2.0-flash-lite-preview-02-05:free", "meta-llama/llama-3.1-8b-instruct:free", "mistralai/mistral-7b-instruct:free"]

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    if not OPENROUTER_API_KEY:
        return {"reply": get_local_response(request.message)}

    # Scan for the latest free models
    available_models = get_available_free_models()
    print(f"Scanned Available Models: {available_models}", flush=True)

    context = f"You are Vyomesh's professional AI assistant. Use this data: {resume_data}. Be concise and professional."
    
    for model in available_models:
        try:
            print(f"Trying scanned model: {model}...", flush=True)
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://portfolio-vyomesh.vercel.app",
                    "X-Title": "Vyomesh AI Portfolio"
                },
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": f"{context}\n\nUser: {request.message}"}]
                },
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                return {"reply": data["choices"][0]["message"]["content"]}
            
            print(f"Model {model} returned status {response.status_code}", flush=True)
        except Exception as e:
            print(f"Request failed for {model}: {e}", flush=True)
            continue

    # Final Fallback to Local Knowledge Engine if all else fails
    print("All scanned models failed. Using local fallback.", flush=True)
    return {"reply": get_local_response(request.message)}
