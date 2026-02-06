from models.schemas import all_attendance_records_data
from bson import ObjectId
from datetime import datetime, timedelta
import pytz
from fastapi import HTTPException
from db import get_database

db = get_database()

async def mark_attendance(data: dict):
    data["employee_id"] = ObjectId(data["employee_id"])
    data["date"] = data.get("date", datetime.utcnow())

    await db["attendance"].insert_one(data)


async def get_today_attendance():
    ist = pytz.timezone("Asia/Kolkata")
    now = datetime.now(ist)

    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1)

    start_utc = start.astimezone(pytz.utc)
    end_utc = end.astimezone(pytz.utc)

    attendance = await db["attendance"].find({
        "date": {"$gte": start_utc, "$lt": end_utc}
    }).to_list(length=None)

    employees = await db["employees"].find().to_list(length=None)

    marked_ids = {str(a["employee_id"]) for a in attendance}

    marked, not_marked = [], []

    for emp in employees:
        emp_id = str(emp["_id"])
        data = {
            "id": emp_id,
            "full_name": emp["full_name"],
            "department": emp.get("department")
        }

        if emp_id in marked_ids:
            record = next(
                (a for a in attendance if str(a["employee_id"]) == emp_id),
                None
            )
            data["status"] = record["status"]
            data["date"] = record["date"].isoformat()
            marked.append(data)
        else:
            not_marked.append(data)

    return {"marked": marked, "not_marked": not_marked}

async def get_attendance_history(employee_id: str):
    records = await db["attendance"].find({"employee_id": employee_id}).to_list(length=10)
    return all_attendance_records_data(records)