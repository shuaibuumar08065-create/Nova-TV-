import asyncio
from sqlalchemy import select

from app.database.db import AsyncSessionLocal
from app.models.user import User

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()

        print(f"Total users: {len(users)}")

        for user in users:
            print("----------------")
            print("ID:", user.id)
            print("Username:", user.username)
            print("Admin:", user.is_admin)
            print("Hashed Password:", user.hashed_password)

asyncio.run(main())
