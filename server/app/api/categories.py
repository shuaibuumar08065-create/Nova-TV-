from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.db import get_session
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category))
    return result.scalars().all()

@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    cat: CategoryCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    new_cat = Category(name=cat.name)
    session.add(new_cat)
    await session.commit()
    await session.refresh(new_cat)
    return new_cat

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    cat: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    db_cat = await session.get(Category, category_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db_cat.name = cat.name
    await session.commit()
    await session.refresh(db_cat)
    return db_cat

@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    db_cat = await session.get(Category, category_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    await session.delete(db_cat)
    await session.commit()
    return {"detail": "Category deleted"}
