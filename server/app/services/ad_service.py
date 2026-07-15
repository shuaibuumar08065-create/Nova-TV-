from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ad import Ad


class AdService:

    @staticmethod
    async def get_all(session: AsyncSession):
        result = await session.execute(select(Ad))
        return result.scalars().all()

    @staticmethod
    async def get_by_id(session: AsyncSession, ad_id: int):
        return await session.get(Ad, ad_id)

    @staticmethod
    async def create(session: AsyncSession, data: dict):
        ad = Ad(**data)
        session.add(ad)
        await session.commit()
        await session.refresh(ad)
        return ad

    @staticmethod
    async def update(session: AsyncSession, ad: Ad, data: dict):
        for key, value in data.items():
            setattr(ad, key, value)

        await session.commit()
        await session.refresh(ad)
        return ad

    @staticmethod
    async def delete(session: AsyncSession, ad: Ad):
        await session.delete(ad)
        await session.commit()

    @staticmethod
    async def add_view(session: AsyncSession, ad: Ad):
        ad.views += 1
        await session.commit()
        await session.refresh(ad)
        return ad

    @staticmethod
    async def add_click(session: AsyncSession, ad: Ad):
        ad.clicks += 1
        await session.commit()
        await session.refresh(ad)
        return ad
