from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests

# ===============================
# Environment Variables Load Karein
# ===============================
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()

# CORS Enable karein (Vercel se connect karne ke liye)
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
    if not OPENROUTER_API_KEY:
        return {"reply": "Error: Render ke Environment Variables mein OPENROUTER_API_KEY missing hai."}

    context = f"""
    You are Vyomesh's AI assistant. Answer questions concisely using ONLY this info: {resume_data}
    """
    
    # 400 Bad Request se bachne ke liye system aur user prompt ko ek single user message mein merge kiya gaya hai
    combined_prompt = f"{context}\n\nUser Question:\n{request.message}"

    # Agar OpenRouter ek model hata deta hai, toh code automatically agla model try karega!
    free_models = [
        "meta-llama/llama-3.1-8b-instruct:free", # Naya Llama 3.1 model
        "huggingfaceh4/zephyr-7b-beta:free",     # Zephyr (Bahut stable hai)
        "mistralai/mistral-7b-instruct:free"     # Mistral Fallback
    ]

    last_error = ""

    for model_id in free_models:
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://portfolio-vyomesh.vercel.app" 
                },
                json={
                    "model": model_id,
                    "messages": [
                        {"role": "user", "content": combined_prompt}
                    ]
                },
                timeout=20 # Har model ko reply karne ke liye 20 seconds denge
            )
            
            # Agar API request successful hai (200 OK)
            if response.status_code == 200:
                data = response.json()
                if "choices" in data and len(data["choices"]) > 0:
                    return {"reply": data["choices"][0]["message"]["content"]}
            
            # Agar model fail hota hai toh error save karke loop continue karega (agla model try karega)
            last_error = f"Model {model_id} failed with code {response.status_code}."
            print(f"Fallback Triggered: {last_error} Details: {response.text}", flush=True)

        except requests.exceptions.Timeout:
            last_error = f"Model {model_id} timed out."
            print(last_error, flush=True)
            continue
        except Exception as e:
            last_error = f"Model {model_id} crashed: {str(e)}"
            print(last_error, flush=True)
            continue

    # Agar saare free models fail ho jate hain tabhi ye final error dikhayega
    return {"reply": f"Sorry, abhi saare AI servers busy hain. Last Error: {last_error}"}
