from motor.motor_asyncio import AsyncIOMotorClient
import os
import dotenv

dotenv.load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient | None = None

db = MongoDB()
try:
    db.client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    db.client.close()

def get_database():
    return db.client["hrms"]
