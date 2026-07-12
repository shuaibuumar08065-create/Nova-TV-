from typing import Dict, Optional
from services.backend import backend
from config import settings

class AuthService:
    _tokens: Dict[int, str] = {}  # user_id -> access_token

    @classmethod
    async def login(cls, user_id: int, username: str, password: str) -> str:
        token = await backend.login(username, password)
        cls._tokens[user_id] = token
        return token

    @classmethod
    def get_token(cls, user_id: int) -> Optional[str]:
        return cls._tokens.get(user_id)

    @classmethod
    def logout(cls, user_id: int) -> bool:
        if user_id in cls._tokens:
            del cls._tokens[user_id]
            return True
        return False

    @classmethod
    def is_authenticated(cls, user_id: int) -> bool:
        return user_id in cls._tokens
