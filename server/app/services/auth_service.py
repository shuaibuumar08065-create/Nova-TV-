from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models.user import User


class AuthService:

    @staticmethod
    async def authenticate(
        session: AsyncSession,
        username: str,
        password: str,
    ) -> User | None:

        result = await session.execute(
            select(User).where(User.username == username)
        )

        user = result.scalar()

        if user is None:
            return None

        if not user.hashed_password:
            return None

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        return user

    @staticmethod
    async def create_admin(
        session: AsyncSession,
    ):

        result = await session.execute(
            select(User).where(
                User.username == settings.ADMIN_USERNAME
            )
        )

        admin = result.scalar()

        if admin is None:

            admin = User(
                username=settings.ADMIN_USERNAME,
                hashed_password=get_password_hash(
                    settings.ADMIN_PASSWORD
                ),
                is_admin=True,
            )

            session.add(admin)
            await session.commit()
            await session.refresh(admin)

        return admin
