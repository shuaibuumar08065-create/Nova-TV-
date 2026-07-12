from services.backend import backend
from services.auth import AuthService

async def get_dashboard(user_id: int):
    token = AuthService.get_token(user_id)
    if not token:
        raise Exception("Not authenticated")
    return await backend.get_dashboard(token)

async def get_analytics(user_id: int):
    token = AuthService.get_token(user_id)
    if not token:
        raise Exception("Not authenticated")
    return await backend.get_analytics(token)
