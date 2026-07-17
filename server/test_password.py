from app.core.security import verify_password

hashed = "$2b$12$/8LFJh4KFKnS/IgyZ8siJeuUS.0YcwAXTL/E/IBF.GBq/8VxaNDzq"

print(verify_password("admin123", hashed))
