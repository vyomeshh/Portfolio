from sqlalchemy.orm import Session
from models import ChatHistory

def save_chat(db: Session, message: str, response: str):
    chat_entry = ChatHistory(
        message=message,
        response=response
    )
    db.add(chat_entry)
    db.commit()
    db.refresh(chat_entry)
    return chat_entry