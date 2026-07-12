from aiogram.fsm.state import State, StatesGroup

class UploadStates(StatesGroup):
    waiting_title = State()
    waiting_description = State()
    waiting_category = State()
    waiting_file = State()
