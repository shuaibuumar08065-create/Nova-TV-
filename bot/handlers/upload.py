from aiogram import Router, types, F
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import ReplyKeyboardRemove

from filters.admin import AdminFilter
from states.upload import UploadStates
from services.auth import AuthService
from services.backend import backend
from services.uploader import upload_video_from_telegram
from keyboards.reply import cancel_keyboard

router = Router()

@router.message(Command("upload"), AdminFilter())
async def cmd_upload(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    if not token:
        await message.answer("⚠️ Please /login first.")
        return

    await state.set_state(UploadStates.waiting_title)
    await message.answer(
        "📝 Send the <b>title</b> of the video.\n"
        "Or send /cancel to abort.",
        reply_markup=cancel_keyboard()
    )

@router.message(UploadStates.waiting_title, F.text)
async def process_title(message: types.Message, state: FSMContext):
    if message.text == "❌ Cancel":
        await state.clear()
        await message.answer("Upload cancelled.", reply_markup=ReplyKeyboardRemove())
        return
    await state.update_data(title=message.text.strip())
    await state.set_state(UploadStates.waiting_description)
    await message.answer("Now send the <b>description</b> (or skip with /skip).")

@router.message(UploadStates.waiting_description, F.text)
async def process_description(message: types.Message, state: FSMContext):
    if message.text == "❌ Cancel":
        await state.clear()
        await message.answer("Upload cancelled.", reply_markup=ReplyKeyboardRemove())
        return
    desc = message.text.strip() if message.text != "/skip" else ""
    await state.update_data(description=desc)
    # Fetch categories
    user_id = message.from_user.id
    token = AuthService.get_token(user_id)
    try:
        cats = await backend.get_categories(token)
        if not cats:
            await message.answer("⚠️ No categories exist. Please add one via web or command.")
            await state.clear()
            return
        # Store categories in state for later reference
        await state.update_data(categories=cats)
        # Ask for category selection
        lines = ["📂 Choose category ID:"]
        for c in cats:
            lines.append(f"  {c['id']} – {c['name']}")
        await state.set_state(UploadStates.waiting_category)
        await message.answer("\n".join(lines))
    except Exception as e:
        await message.answer(f"❌ Error fetching categories: {str(e)}")
        await state.clear()

@router.message(UploadStates.waiting_category, F.text)
async def process_category(message: types.Message, state: FSMContext):
    if message.text == "❌ Cancel":
        await state.clear()
        await message.answer("Upload cancelled.", reply_markup=ReplyKeyboardRemove())
        return
    try:
        cat_id = int(message.text.strip())
        data = await state.get_data()
        cats = data.get('categories', [])
        if not any(c['id'] == cat_id for c in cats):
            await message.answer("❌ Invalid category ID. Please enter a valid one.")
            return
        await state.update_data(category_id=cat_id)
        await state.set_state(UploadStates.waiting_file)
        await message.answer(
            "📤 Now send the <b>video file</b> (MP4, MKV, etc.).",
            reply_markup=cancel_keyboard()
        )
    except ValueError:
        await message.answer("❌ Please send a valid numeric ID.")

@router.message(UploadStates.waiting_file, F.video | F.document)
async def process_file(message: types.Message, state: FSMContext, bot):
    if message.text == "❌ Cancel":
        await state.clear()
        await message.answer("Upload cancelled.", reply_markup=ReplyKeyboardRemove())
        return

    user_id = message.from_user.id
    data = await state.get_data()
    title = data['title']
    description = data['description']
    category_id = data['category_id']

    # Get file info
    if message.video:
        file_id = message.video.file_id
        filename = message.video.file_name or f"{title}.mp4"
        thumb_id = message.video.thumbnail.file_id if message.video.thumbnail else None
    elif message.document:
        # Assume document is a video
        file_id = message.document.file_id
        filename = message.document.file_name or f"{title}.mp4"
        thumb_id = None
    else:
        await message.answer("❌ Please send a video file.")
        return

    try:
        result = await upload_video_from_telegram(
            bot=bot,
            user_id=user_id,
            title=title,
            description=description,
            category_id=category_id,
            file_id=file_id,
            filename=filename,
            thumbnail_id=thumb_id
        )
        await message.answer(
            f"✅ Video <b>{title}</b> uploaded successfully!\n"
            f"ID: {result['id']}",
            reply_markup=ReplyKeyboardRemove()
        )
    except Exception as e:
        await message.answer(f"❌ Upload failed: {str(e)}", reply_markup=ReplyKeyboardRemove())
    finally:
        await state.clear()

# Cancel handler
@router.message(Command("cancel"))
async def cmd_cancel(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer("Operation cancelled.", reply_markup=ReplyKeyboardRemove())
