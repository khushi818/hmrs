from bson import ObjectId
from fastapi import HTTPException, status
from db import get_database

db = get_database()

async def get_all_employees(limit: int = 50):
    return await db["employees"].find().to_list(length=limit)


async def create_employee(employee: dict):
    employee["email_address"] = employee["email_address"].lower()

    existing = await db["employees"].find_one({
        "email_address": employee["email_address"]
    })

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee already exists"
        )

    result = await db["employees"].insert_one(employee)
    return str(result.inserted_id)


async def delete_employee(employee_id: str):
    result = await db["employees"].delete_one({
        "_id": ObjectId(employee_id)
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
