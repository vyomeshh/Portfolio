import requests
from config import OPENROUTER_API_KEY, MODEL_NAME

print("DEBUG KEY:", OPENROUTER_API_KEY)
def get_ai_response(prompt: str):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AI Resume Portfolio"
        },
        json={
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "system",
                    "content": "You answer only from resume content."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3
        }
    )

    data = response.json()

    if response.status_code != 200:
        return f"OpenRouter Error: {data}"

    return data["choices"][0]["message"]["content"]